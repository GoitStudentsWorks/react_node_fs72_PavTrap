import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login, startLoadingMainPage } from '../../redux/Auth/authOperation';
import { useFormik } from 'formik';
import css from './LoginForm.module.css';
import { AuthNavigate } from 'components/AuthNavigate/AuthNavigate';
import { useNavigate } from 'react-router-dom';

import { LoginSchema } from '../RegisterForm/ValidationSchema';

import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { RiErrorWarningLine } from 'react-icons/ri';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

import useAuth from 'hooks/useAuth';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    loginForm,
    loginTitle,
    inputWrapper,
    loginInput,
    loginButton,
    wrapper,
    errorIconClass,
    validIconClass,
    passwordToggleIcon,
    error,
    validBorder,
    invalidBorder,
  } = css;
  // const [erorMessage, setErrorMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const { BackEndError } = useAuth();

  // useEffect(() => {
  //   if (BackEndError) setErrorMessage(BackEndError);
  //   setTimeout(() => setErrorMessage(null), 3000);
  // }, [BackEndError]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { resetForm }) => {
      const user = {
        email: values.email,
        password: values.password,
      };
      if (user.email !== '' && user.password !== '') {
        dispatch(login(user));
        if (!BackEndError) {

          navigate('/');
          dispatch(startLoadingMainPage())
          resetForm();
        }
      }
      // else {
      //   setErrorMessage('Please enter email and password');
      //   setTimeout(() => setErrorMessage(null), 3000);
      // }
    },
  });

  return (
    <form className={loginForm} onSubmit={formik.handleSubmit}>
      <h1 className={loginTitle}> Sign In </h1>
      <div className={wrapper}>
        <div className={inputWrapper}>
          <input
            className={`${loginInput} ${formik.touched.email ? (formik.errors.email ? invalidBorder : validBorder) : ''}`}
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            autoComplete="off"
          />
          {formik.touched.email && ( // Перевірка, чи інпут був доторкнутий
            <>
              {formik.errors.email && ( // Перевірка наявності помилки
                <div>
                  <RiErrorWarningLine className={errorIconClass} />
                  <p className={error} style={{ color: 'red' }}>
                    {formik.errors.email}
                  </p>
                </div>
              )}
              {!formik.errors.email && ( // Перевірка відсутності помилки
                <div>
                  <IoIosCheckmarkCircleOutline className={validIconClass} />
                  <p className={error} style={{ color: 'green' }}>
                    This is a CORRECT email
                  </p>
                </div>
              )}
            </>
          )}
        </div>
        <div className={inputWrapper}>
          <div className="password-input-wrapper">
            <input
              className={`${loginInput} ${formik.touched.password ? (formik.errors.password ? invalidBorder : validBorder) : ''}`}
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              autoComplete="off"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
          </div>
          <div onClick={togglePasswordVisibility}>
            {' '}
            {showPassword ? <AiOutlineEye className={passwordToggleIcon} /> : <AiOutlineEyeInvisible className={passwordToggleIcon} />}
          </div>
          {formik.touched.password && ( // Перевірка, чи інпут був доторкнутий
            <>
              {formik.errors.password && ( // Перевірка наявності помилки
                <div>
                  <p className={error} style={{ color: 'red' }}>
                    {formik.errors.password}
                  </p>
                </div>
              )}
              {!formik.errors.password && ( // Перевірка відсутності помилки
                <div>
                  <p className={error} style={{ color: 'green' }}>
                    This is a CORRECT password
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <button className={loginButton} type="submit">
        Sign In
      </button>
      <AuthNavigate />
    </form>
  );
};

export default LoginForm;
