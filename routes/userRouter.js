const userRouter = require('express').Router();
const bcrypt = require('bcrypt');
const { User } = require('../db/models');
const isUser = require('../middlewares/isUser');

userRouter.get('/', (req, res) => {
  res.json(req.session?.user || '');
});

userRouter.post('/registration', async (req, res) => {
  const { login, password, email } = req.body;
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        error: 'Почта уже используются.',
      });
    } else{
      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({ login, email, password: hash });
      
      const clearedUser = {
        id: user.id,
        login: user.login,
        email: user.email,
      };
  
      req.session.user = clearedUser;
  
      res.json(clearedUser);
    }
  } catch (error) {
    console.log("Ошибка во время регистрации пользователя:", error);
    res.status(400);

  }
});


// userRouter.post('/login', async (req, res) => {
//   console.log(req.body, 'req.body');
//   const { login, password } = req.body;
//   try {
//     const user = await User.findOne({ where: { login } });
//     if (!user) {
//       res.status(300).json({ message: 'Пользователя не существует' });
//     } else {
//       const passwordCompare = await bcrypt.compare(password, user.password);
//       if (!passwordCompare) {
//         res.status(400).json({ message: 'Неверный пароль' });
//       } if (passwordCompare || user) {
//         const clearedUser = {
//           id: user.id,
//           login: user.login,
//           email: user.email,
//         };
//         req.session.user = clearedUser;
//         console.log('Это route', clearedUser)
//         res.status(200).res.json(clearedUser);
//       } else {
//         res.status(400);
//       }
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(400);
//   }
// });
userRouter.post('/login', async (req, res) => {
  const { login, password } = req.body;
  try {
    const user = await User.findOne({ where: { login } });
    if (!user) {
      res.status(300).json({ message: 'Пользователя не существует' });
    } else {
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        res.status(400).json({ message: 'Неверный пароль' });
      } else {
        const clearedUser = {
          id: user.id,
          login: user.login,
          email: user.email,
        };
        req.session.user = clearedUser;
        res.status(200).json(clearedUser);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400);
  }
});
// userRouter.post('/login', async (req, res) => {
//   console.log(req.body, 'req.body');
//   const { login, password } = req.body;
//   if (!login || !password) {
//     return res.status(400).json({ message: 'Логин и пароль обязательны' });
//   }
//   try {
//     const user = await User.findOne({ where: { login } });
//     if (!user) {
//       return res.status(300).json({ message: 'Пользователя не существует' });
//     }

//     // Сравниваем пароль
//     const passwordCompare = await bcrypt.compare(password, user.password);
//     if (!passwordCompare) {
//       return res.status(400).json({ message: 'Неверный пароль' });
//     }

//     // Если пароль совпадает
//     const clearedUser = {
//       id: user.id,
//       login: user.login,
//       email: user.email,
//     };
//     req.session.user = clearedUser;

//     // Возвращаем очищенного пользователя в ответ
//     return res.status(200).json(clearedUser);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: 'Произошла ошибка при входе пользователя' });
//   }
// });


userRouter.get('/logout', isUser, async (req, res) => {
  try {
    req.session.destroy(() => {
      res.clearCookie('reactCookies');
      res.sendStatus(200);
    });
  } catch (error) {
    console.log('Ошибка: ', error);
  }
});

module.exports = userRouter;
