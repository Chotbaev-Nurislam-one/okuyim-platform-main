const translations = {
  kg: {
    // Жалпы
    appName: "Олимпиада Платформасы",
    welcome: "Кош келиңиз",

    // Навигация
    nav: {
      home: "Башкы бет",
      olympiads: "Олимпиадалар",
      dashboard: "Кабинет",
      profile: "Профиль",
      login: "Кируу",
      register: "Катталуу",
      logout: "Чыгуу",
      createOlympiad: "Олимпиада түзүү",
      myOlympiads: "Менин олимпиадаларым",
      adminPanel: "Админ-панел",
    },
    dashboard: {
      welcome: "Кош келиңиз",
      subtitle:
        "Бул сиздин жеке башкаруу панелеңиз. Бул жерде сиздин олимпиадаларыңыз жана жыйынтыктарыңыз көрсөтүлөт.",
      availableOlympiads: "Колдонууга дайын олимпиадалар",
      noActiveOlympiads: "Сизде активдүү олимпиадалар жок",
      completed: "Аякталган",
      noCompletedOlympiads: "0 аякталган олимпиадалар",
      results: "Жыйынтыктар",
      noResults: "Жыйынтыктар жок",
    },
    // Катталуу
    register: {
      title: "Катталуу",
      subtitle: "Олимпиадаларга катышуу үчүн аккаунт түзүңүз",
      firstName: "Аты",
      lastName: "Фамилиясы",
      email: "Электрондук почта",
      phone: "Телефон",
      password: "Сырсөз",
      confirmPassword: "Сырсөздү тастыктаңыз",
      institution: "Окуу жайы",
      selectInstitution: "Окуу жайын тандаңыз",
      university: "Университет",
      college: "Колледж",
      kgtu: "КГТУ",
      otherUniversity: "Башка университет",
      customUniversityPlaceholder: "Университеттин атын жазыңыз",
      institute: "Институт",
      selectInstitute: "Институтту тандаңыз",
      grade: "Курс",
      selectGrade: "Курсту тандаңыз",
      group: "Топ",
      groupPlaceholder: "Мисалы: ИТ-1-23",
      registerButton: "Катталуу",
      alreadyHaveAccount: "Аккаунтуңуз барбы?",
      loginLink: "Кируу",

      // Институттар
      institutes: {
        mining: "Кыргыз тоо-металлургия институту им. акад. У. Асаналиева",
        civil: "Кыргыз инженердик-курулуш институту им. Н. Исанова",
        architecture: "Архитектура жана дизайн институту",
        it: "Маалыматтык технологиялар институту",
        electronics: "Электроника жана телекоммуникациялар институту",
        german: "Кыргыз-Герман техникалык институту",
        transport: "Транспорт жана робототехника институту",
        technology: "Технологиялык институт",
        energy: "Энергетика институту",
      },

      // Валидация
      validation: {
        firstNameRequired: "Атыңызды жазыңыз",
        lastNameRequired: "Фамилияңызды жазыңыз",
        emailRequired: "Электрондук почтаңызды жазыңыз",
        emailInvalid: "Туура электрондук почта дарегин жазыңыз",
        phoneRequired: "Телефонуңузду жазыңыз",
        phoneInvalid: "Туура телефон номерин жазыңыз (+996 XXX XX XX XX)",
        passwordRequired: "Сырсөзүңүздү жазыңыз",
        passwordMinLength: "Сырсөз кеминде 6 символдон турушу керек",
        confirmPasswordRequired: "Сырсөздү тастыктаңыз",
        passwordsNotMatch: "Сырсөздөр дал келбейт",
        institutionRequired: "Окуу жайыңызды тандаңыз",
        universityRequired: "Университетти тандаңыз же атын жазыңыз",
        collegeRequired: "Колледждүн атын жазыңыз",
        customUniversityRequired: "Университеттин атын жазыңыз",
        gradeRequired: "Курсуңузду тандаңыз",
        gradeRange: "Курс 1-4 чейин болушу керек",
        groupRequired: "Топтун атын жазыңыз",
        instituteRequired: "Институтту тандаңыз",
      },

      // Сообщения
      messages: {
        success: "Катталуу ийгиликтүү аяктады! Сураныч, системага кириңиз.",
        error: "Катталууда ката кетти. Кийинчерээк кайталаңыз.",
        emailExists: "Бул электрондук почта менен колдонуучу мурунтан эле бар",
      },
    },

    // Логин
    login: {
      title: "Системага кирүү",
      subtitle: "Олимпиадаларга катышуу үчүн кириңиз",
      email: "Электрондук почта",
      emailPlaceholder: "Электрондук почтаңызды жазыңыз",
      password: "Сырсөз",
      passwordPlaceholder: "Сырсөзүңүздү жазыңыз",
      rememberMe: "Эсимде сакта",
      forgotPassword: "Сырсөзүңүздү унуттуңузбу?",
      loginButton: "Кирүү",
      loggingIn: "Кирүү...",
      noAccount: "Аккаунтуңуз жокпу?",
      registerLink: "Катталуу",
      demoInfo: "Тест маалыматтары: demo@example.com / password123",

      // Валидация
      validation: {
        emailRequired: "Электрондук почтаңызды жазыңыз",
        emailInvalid: "Туура электрондук почта дарегин жазыңыз",
        passwordRequired: "Сырсөзүңүздү жазыңыз",
        fieldsRequired: "Электрондук почта жана сырсөз толтурулушу керек",
      },

      // Сообщения об ошибках
      messages: {
        success: "Системага ийгиликтүү кирдиңиз! Багытталуу...",
        invalidCredentials:
          "❌ Аккаунт табылган жок же логин/сырсөз туура эмес",
        accountDisabled: "⚠️ Аккаунт бөгөттөлгөн. Администраторго кайрылыңыз",
        validationError: "⚠️ Форманы толтурууда каталар бар",
        serverError: "🔧 Серверде ката кетти. Кийинчерээк аракет кылыңыз",
        connectionError:
          "🌐 Серверге туташуу мүмкүн эмес. Интернетти текшериңиз",
        error: "Кирүүдө ката кетти. Кайра аракет кылыңыз",
        tryAgain: "Кайра аракет кылыңыз же сырсөзүңүздү калыбына келтириңиз",
      },
    },

    forgotPassword: {
      title: "Сырсөзүңүздү унуттуңузбу?",
      subtitle:
        "Электрондук почтаңызды жазыңыз, сырсөзүңүздү калыбына келтирүү кодун жөнөтөбүз",
      email: "Электрондук почта",
      emailPlaceholder: "Электрондук почтаңызды жазыңыз",
      sendCode: "Код жөнөтүү",
      sending: "Жөнөтүү...",
      checkEmail: "Электрондук почтаны текшериңиз",
      codeSentTo: "Сырсөз калыбына келтирүү коду жөнөтүлдү",
      enterCode: "Код киргизүү",
      back: "Артка",
      backToLogin: "Кирүүгө кайтуу",
      emailHint: "Катталууда колдонгон электрондук почтаңызды жазыңыз",

      validation: {
        emailRequired: "Электрондук почтаңызды жазыңыз",
        emailInvalid: "Туура электрондук почта дарегин жазыңыз",
      },

      messages: {
        codeSent:
          "Сырсөз калыбына келтирүү коду электрондук почтаңызга жөнөтүлдү!",
        previewEmail: "Почтаны карап чыгуу үчүн шилтемени колдонсоңуз болот:",
        emailNotFound: "Бул электрондук почта менен колдонуучу табылган жок",
        serverError: "Серверде ката кетти. Кийинчерээк аракет кылыңыз",
        error: "Код жөнөтүүдө ката кетти. Кайра аракет кылыңыз",
      },
    },

    resetPassword: {
      verifyTitle: "Кодду тастыктоо",
      verifySubtitle:
        "Электрондук почтаңызга жөнөтүлгөн 6-цифрдуу кодду киргизиңиз",
      resetTitle: "Жаңы сырсөз түзүү",
      resetSubtitle: "Жаңы ишенимдүү сырсөз ойлоп табыңыз",
      code: "Тастыктоо коду",
      codePlaceholder: "6-цифрдуу кодду киргизиңиз",
      codeHint: "Каттан 6-цифрдуу кодду киргизиңиз",
      newPassword: "Жаңы сырсөз",
      newPasswordPlaceholder: "Жаңы сырсөз киргизиңиз",
      confirmPassword: "Сырсөздү тастыктаңыз",
      confirmPasswordPlaceholder: "Жаңы сырсөздү кайталаңыз",
      verifyButton: "Тастыктоо",
      resetButton: "Сырсөздү калыбына келтирүү",
      verifying: "Текшерүү...",
      resetting: "Калыбына келтирүү...",
      backToLogin: "Кирүүгө кайтуу",
      codeSentTo: "Код жөнөтүлдү",
      back: "Артка",
      resendCode: "Кодду кайра жөнөтүү",
      codeVerified: "Код тастыкталды!",

      validation: {
        codeRequired: "Тастыктоо кодун киргизиңиз",
        codeInvalid: "Код 6 цифрдан турушу керек",
        passwordRequired: "Жаңы сырсөз киргизиңиз",
        passwordMinLength: "Сырсөз кеминде 6 символдон турушу керек",
        confirmPasswordRequired: "Сырсөздү тастыктаңыз",
        passwordsNotMatch: "Сырсөздөр дал келбейт",
      },

      messages: {
        codeVerified: "Код тастыкталды! Эми жаңы сырсөз түзүңүз.",
        invalidCode: "Тастыктоо коду туура эмес",
        invalidLink: "Сырсөз калыбына келтирүү үчүн жараксыз шилтеме",
        verifyError: "Кодду текшерүүдө ката кетти",
        success:
          "Сырсөз ийгиликтүү өзгөртүлдү! Кирүү баракчасына багытталуу...",
        resetError:
          "Сырсөз калыбына келтирүүдө ката кетти. Кайра аракет кылыңыз",
      },
    },

    // Форматы
    formats: {
      phonePlaceholder: "+996 XXX XX XX XX",
    },
  },

  ru: {
    // Общие
    appName: "Олимпиада Платформасы",
    welcome: "Добро пожаловать",

    // Навигация
    nav: {
      home: "Главная",
      olympiads: "Олимпиады",
      dashboard: "Кабинет",
      profile: "Профиль",
      login: "Вход",
      register: "Регистрация",
      logout: "Выход",
      createOlympiad: "Создать олимпиаду",
      myOlympiads: "Мои олимпиады",
      adminPanel: "Панель администратора",
    },
    dashboard: {
      welcome: "Добро пожаловать",
      subtitle:
        "Это ваша личная панель управления. Здесь будут отображаться ваши олимпиады и результаты.",
      availableOlympiads: "Доступные олимпиады",
      noActiveOlympiads: "У вас нет активных олимпиад",
      completed: "Завершенные",
      noCompletedOlympiads: "0 завершенных олимпиад",
      results: "Результаты",
      noResults: "Нет результатов",
    },
    // Регистрация
    register: {
      title: "Регистрация",
      subtitle: "Создайте аккаунт для участия в олимпиадах",
      firstName: "Имя",
      lastName: "Фамилия",
      email: "Email",
      phone: "Телефон",
      password: "Пароль",
      confirmPassword: "Подтвердите пароль",
      institution: "Учебное заведение",
      selectInstitution: "Выберите учебное заведение",
      university: "Университет",
      college: "Колледж",
      kgtu: "КГТУ",
      otherUniversity: "Другой университет",
      customUniversityPlaceholder: "Введите название университета",
      institute: "Институт",
      selectInstitute: "Выберите институт",
      grade: "Курс",
      selectGrade: "Выберите курс",
      group: "Группа",
      groupPlaceholder: "Например: ИТ-1-23",
      registerButton: "Зарегистрироваться",
      alreadyHaveAccount: "Уже есть аккаунт?",
      loginLink: "Войти",

      // Институты
      institutes: {
        mining:
          "Кыргызский горно-металлургический институт им. акад. У. Асаналиева",
        civil: "Кыргызский инженерно-строительный институт им. Н. Исанова",
        architecture: "Институт архитектуры и дизайна",
        it: "Институт информационных технологий",
        electronics: "Институт электроники и телекоммуникаций",
        german: "Кыргызско-Германский технический институт",
        transport: "Институт транспорта и робототехники",
        technology: "Технологический институт",
        energy: "Энергетический институт",
      },

      // Валидация
      validation: {
        firstNameRequired: "Имя обязательно",
        lastNameRequired: "Фамилия обязательна",
        emailRequired: "Email обязателен",
        emailInvalid: "Введите корректный email",
        phoneRequired: "Телефон обязателен",
        phoneInvalid: "Введите корректный номер телефона (+996 XXX XX XX XX)",
        passwordRequired: "Пароль обязателен",
        passwordMinLength: "Пароль должен содержать минимум 6 символов",
        confirmPasswordRequired: "Подтвердите пароль",
        passwordsNotMatch: "Пароли не совпадают",
        institutionRequired: "Выберите учебное заведение",
        universityRequired: "Выберите или введите название университета",
        collegeRequired: "Введите название колледжа",
        customUniversityRequired: "Введите название университета",
        gradeRequired: "Выберите курс",
        gradeRange: "Курс должен быть от 1 до 4",
        groupRequired: "Укажите название группы",
        instituteRequired: "Выберите институт",
      },

      // Сообщения
      messages: {
        success: "Регистрация успешна! Пожалуйста, войдите в систему.",
        error: "Ошибка при регистрации. Попробуйте позже.",
        emailExists: "Пользователь с таким email уже существует",
      },
    },

    // Логин
    login: {
      title: "Вход в систему",
      subtitle: "Войдите для участия в олимпиадах",
      email: "Email",
      emailPlaceholder: "Введите ваш email",
      password: "Пароль",
      passwordPlaceholder: "Введите ваш пароль",
      rememberMe: "Запомнить меня",
      forgotPassword: "Забыли пароль?",
      loginButton: "Войти",
      loggingIn: "Вход...",
      noAccount: "Нет аккаунта?",
      registerLink: "Зарегистрироваться",
      demoInfo: "Тестовые данные: demo@example.com / password123",

      // Валидация
      validation: {
        emailRequired: "Пожалуйста, введите email",
        emailInvalid: "Введите корректный email адрес",
        passwordRequired: "Пожалуйста, введите пароль",
        fieldsRequired: "Email и пароль обязательны для заполнения",
      },

      // Сообщения об ошибках
      messages: {
        success: "Успешный вход! Перенаправление...",
        invalidCredentials: "❌ Аккаунт не найден или неверный логин/пароль",
        accountDisabled: "⚠️ Аккаунт заблокирован. Обратитесь к администратору",
        validationError:
          "⚠️ Пожалуйста, проверьте правильность заполнения формы",
        serverError: "🔧 Ошибка сервера. Пожалуйста, попробуйте позже",
        connectionError:
          "🌐 Не удается подключиться к серверу. Проверьте соединение",
        error: "Ошибка входа. Попробуйте позже",
        tryAgain: "Попробуйте еще раз или восстановите пароль",
      },
    },

    forgotPassword: {
      title: "Забыли пароль?",
      subtitle: "Введите ваш email, и мы отправим код для сброса пароля",
      email: "Email",
      emailPlaceholder: "Введите ваш email",
      sendCode: "Отправить код",
      sending: "Отправка...",
      checkEmail: "Проверьте email",
      codeSentTo: "Код сброса пароля отправлен на",
      enterCode: "Ввести код",
      back: "Назад",
      backToLogin: "Вернуться к входу",
      emailHint: "Введите email, который вы использовали при регистрации",

      validation: {
        emailRequired: "Введите email",
        emailInvalid: "Введите корректный email адрес",
      },

      messages: {
        codeSent: "Код сброса пароля отправлен на ваш email!",
        previewEmail: "Посмотреть письмо можно по ссылке:",
        emailNotFound: "Пользователь с таким email не найден",
        serverError: "Ошибка сервера. Попробуйте позже",
        error: "Ошибка при отправке кода. Попробуйте позже",
      },
    },

    resetPassword: {
      verifyTitle: "Подтверждение кода",
      verifySubtitle: "Введите 6-значный код, отправленный на ваш email",
      resetTitle: "Создание нового пароля",
      resetSubtitle: "Придумайте новый надежный пароль",
      code: "Код подтверждения",
      codePlaceholder: "Введите 6-значный код",
      codeHint: "Введите 6-значный код из письма",
      newPassword: "Новый пароль",
      newPasswordPlaceholder: "Введите новый пароль",
      confirmPassword: "Подтвердите пароль",
      confirmPasswordPlaceholder: "Повторите новый пароль",
      verifyButton: "Подтвердить",
      resetButton: "Сбросить пароль",
      verifying: "Проверка...",
      resetting: "Сброс...",
      backToLogin: "Вернуться к входу",
      codeSentTo: "Код отправлен на",
      back: "Назад",
      resendCode: "Отправить код повторно",
      codeVerified: "Код подтвержден!",

      validation: {
        codeRequired: "Введите код подтверждения",
        codeInvalid: "Код должен состоять из 6 цифр",
        passwordRequired: "Введите новый пароль",
        passwordMinLength: "Пароль должен содержать минимум 6 символов",
        confirmPasswordRequired: "Подтвердите пароль",
        passwordsNotMatch: "Пароли не совпадают",
      },

      messages: {
        codeVerified: "Код подтвержден! Теперь создайте новый пароль.",
        invalidCode: "Неверный код подтверждения",
        invalidLink: "Недействительная ссылка для сброса пароля",
        verifyError: "Ошибка при проверке кода",
        success: "Пароль успешно изменен! Перенаправление на страницу входа...",
        resetError: "Ошибка при сбросе пароля. Попробуйте позже",
      },
    },

    // Форматы
    formats: {
      phonePlaceholder: "+996 XXX XX XX XX",
    },
  },

  en: {
    // General
    appName: "Olympiad Platform",
    welcome: "Welcome",

    // Navigation
    nav: {
      home: "Home",
      olympiads: "Olympiads",
      dashboard: "Dashboard",
      profile: "Profile",
      login: "Login",
      register: "Register",
      logout: "Logout",
      createOlympiad: "Create Olympiad",
      myOlympiads: "My Olympiads",
      adminPanel: "Admin Panel",
    },
    dashboard: {
      welcome: "Welcome",
      subtitle:
        "This is your personal dashboard. Your olympiads and results will appear here.",
      availableOlympiads: "Available Olympiads",
      noActiveOlympiads: "You have no active olympiads",
      completed: "Completed",
      noCompletedOlympiads: "0 completed olympiads",
      results: "Results",
      noResults: "No results",
    },
    // Registration
    register: {
      title: "Registration",
      subtitle: "Create an account to participate in olympiads",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      phone: "Phone",
      password: "Password",
      confirmPassword: "Confirm Password",
      institution: "Educational Institution",
      selectInstitution: "Select institution",
      university: "University",
      college: "College",
      kgtu: "KSTU",
      otherUniversity: "Other University",
      customUniversityPlaceholder: "Enter university name",
      institute: "Institute",
      selectInstitute: "Select institute",
      grade: "Course",
      selectGrade: "Select course",
      group: "Group",
      groupPlaceholder: "Example: IT-1-23",
      registerButton: "Register",
      alreadyHaveAccount: "Already have an account?",
      loginLink: "Login",

      // Institutes
      institutes: {
        mining:
          "Kyrgyz Mining and Metallurgical Institute named after Acad. U. Asanaliev",
        civil: "Kyrgyz Institute of Civil Engineering named after N. Isanov",
        architecture: "Institute of Architecture and Design",
        it: "Institute of Information Technologies",
        electronics: "Institute of Electronics and Telecommunications",
        german: "Kyrgyz-German Technical Institute",
        transport: "Institute of Transport and Robotics",
        technology: "Technological Institute",
        energy: "Energy Institute",
      },

      // Validation
      validation: {
        firstNameRequired: "Please enter your first name",
        lastNameRequired: "Please enter your last name",
        emailRequired: "Please enter your email",
        emailInvalid: "Please enter a valid email address",
        phoneRequired: "Please enter your phone number",
        phoneInvalid: "Please enter a valid phone number (+996 XXX XX XX XX)",
        passwordRequired: "Please enter your password",
        passwordMinLength: "Password must be at least 6 characters",
        confirmPasswordRequired: "Please confirm your password",
        passwordsNotMatch: "Passwords do not match",
        institutionRequired: "Please select your institution",
        universityRequired: "Please select or enter university name",
        collegeRequired: "Please enter college name",
        customUniversityRequired: "Please enter university name",
        gradeRequired: "Please select your course",
        gradeRange: "Course must be between 1 and 4",
        groupRequired: "Please enter your group name",
        instituteRequired: "Please select your institute",
      },

      // Messages
      messages: {
        success: "Registration successful! Please log in.",
        error: "Registration failed. Please try again later.",
        emailExists: "A user with this email already exists",
      },
    },

    // Login
    login: {
      title: "Login",
      subtitle: "Login to participate in olympiads",
      email: "Email",
      emailPlaceholder: "Enter your email",
      password: "Password",
      passwordPlaceholder: "Enter your password",
      rememberMe: "Remember me",
      forgotPassword: "Forgot password?",
      loginButton: "Login",
      loggingIn: "Logging in...",
      noAccount: "Don't have an account?",
      registerLink: "Register",
      demoInfo: "Test credentials: demo@example.com / password123",

      // Validation
      validation: {
        emailRequired: "Please enter your email",
        emailInvalid: "Please enter a valid email address",
        passwordRequired: "Please enter your password",
        fieldsRequired: "Email and password are required",
      },

      // Error messages
      messages: {
        success: "Login successful! Redirecting...",
        invalidCredentials: "❌ Account not found or invalid email/password",
        accountDisabled: "⚠️ Account is disabled. Please contact administrator",
        validationError: "⚠️ Please check the form for errors",
        serverError: "🔧 Server error. Please try again later",
        connectionError: "🌐 Cannot connect to server. Check your connection",
        error: "Login failed. Please try again",
        tryAgain: "Please try again or reset your password",
      },
    },

    forgotPassword: {
      title: "Forgot Password?",
      subtitle: "Enter your email and we'll send you a password reset code",
      email: "Email",
      emailPlaceholder: "Enter your email",
      sendCode: "Send Code",
      sending: "Sending...",
      checkEmail: "Check your email",
      codeSentTo: "Password reset code sent to",
      enterCode: "Enter Code",
      back: "Back",
      backToLogin: "Back to Login",
      emailHint: "Enter the email you used during registration",

      validation: {
        emailRequired: "Please enter your email",
        emailInvalid: "Please enter a valid email address",
      },

      messages: {
        codeSent: "Password reset code sent to your email!",
        previewEmail: "You can view the email at the following link:",
        emailNotFound: "User with this email not found",
        serverError: "Server error. Please try again later",
        error: "Error sending code. Please try again",
      },
    },

    resetPassword: {
      verifyTitle: "Code Verification",
      verifySubtitle: "Enter the 6-digit code sent to your email",
      resetTitle: "Create New Password",
      resetSubtitle: "Create a new strong password",
      code: "Verification Code",
      codePlaceholder: "Enter 6-digit code",
      codeHint: "Enter the 6-digit code from your email",
      newPassword: "New Password",
      newPasswordPlaceholder: "Enter new password",
      confirmPassword: "Confirm Password",
      confirmPasswordPlaceholder: "Repeat new password",
      verifyButton: "Verify",
      resetButton: "Reset Password",
      verifying: "Verifying...",
      resetting: "Resetting...",
      backToLogin: "Back to Login",
      codeSentTo: "Code sent to",
      back: "Back",
      resendCode: "Resend code",
      codeVerified: "Code verified!",

      validation: {
        codeRequired: "Please enter verification code",
        codeInvalid: "Code must be 6 digits",
        passwordRequired: "Please enter new password",
        passwordMinLength: "Password must be at least 6 characters",
        confirmPasswordRequired: "Please confirm password",
        passwordsNotMatch: "Passwords do not match",
      },

      messages: {
        codeVerified: "Code verified! Now create your new password.",
        invalidCode: "Invalid verification code",
        invalidLink: "Invalid password reset link",
        verifyError: "Error verifying code",
        success: "Password changed successfully! Redirecting to login page...",
        resetError: "Error resetting password. Please try again",
      },
    },

    // Formats
    formats: {
      phonePlaceholder: "+996 XXX XX XX XX",
    },
  },
};

export default translations;
