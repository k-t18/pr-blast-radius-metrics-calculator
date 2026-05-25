'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useLogin } from '../../../hooks/auth/useLogin';
import InputField from '../../../components/form-fields/inputField/InputField';
import PasswordField from '../../../components/form-fields/passwordField/PasswordField';
import FormLabel from '../../../components/common/FormLabel';
import HeaderTitle from '../../../components/common/HeaderTitle';
import { logoutAPI } from '../../../services/auth/logout/logout.api';
import '../../../styles/login/login.css';

interface LoginFormData {
    email: string;
    password: string;
}

export function ChancesLoginForm() {
    const loginMutation = useLogin();
    const {
        control,
        handleSubmit,
        formState: { isValid },
    } = useForm<LoginFormData>({
        mode: 'onChange',
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = (data: LoginFormData) => {
        loginMutation.mutate({
            email: data.email,
            password: data.password,
        });
    };

    useEffect(() => {
        logoutAPI();
    }, []);

    return (
        <div className="chances-login-container">
            <div className="chances-login-card">
                <img src="/assets/images/chances-logo.webp" alt="Chances Logo" className="mx-auto w-52 mb-5" />
                <HeaderTitle text="Welcome to CHANCES" size="2xl" weight="medium" className="text-center font-ubuntu" />

                <div className="pt-8 mb-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Email Field */}
                        <div className="form-group">
                            <FormLabel id="email" label="Email Address" required />
                            <Controller
                                name="email"
                                control={control}
                                rules={{
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[\w%+.-]+@[\d.a-z-]+\.[a-z]{2,}$/i,
                                        message: 'Invalid email address',
                                    },
                                }}
                                render={({ field, fieldState }) => (
                                    <InputField
                                        id="email"
                                        name={field.name}
                                        type="email"
                                        placeholder="Enter Email Address"
                                        value={field.value ?? ''}
                                        onChange={value => field.onChange(value)}
                                        error={fieldState.error?.message}
                                        required
                                    />
                                )}
                            />
                        </div>

                        {/* Password Field */}
                        <div className="form-group">
                            <FormLabel id="password" label="Password" required />
                            <Controller
                                name="password"
                                control={control}
                                rules={{
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters',
                                    },
                                }}
                                render={({ field, fieldState }) => (
                                    <PasswordField
                                        id="password"
                                        name={field.name}
                                        placeholder="Enter your password"
                                        value={field.value ?? ''}
                                        onChange={value => field.onChange(value)}
                                        error={fieldState.error?.message}
                                        required
                                    />
                                )}
                            />
                        </div>

                        {/* Forgot Password Link
                        <div className="forgot-password-wrapper">
                            <Link to="/" className="forgot-password-link">
                                Forgot Password?
                            </Link>
                        </div>

                        {/* Login Button */}
                        <button type="submit" disabled={!isValid || loginMutation.isPending} className="login-button w-full">
                            {loginMutation.isPending ? 'Logging in...' : 'Login'}
                        </button>
                        {/* {loginMutation.error ? <p className="text-red-500 text-sm">{loginMutation.error.message}</p> : null} */}
                    </form>
                </div>

                {/* Register Section */}
                <div>
                    <p className="register-text text-center w-full">
                        New to Chances?{' '}
                        <Link to="/registration" className="text-brand-500 hover:text-brand-600 underline transition-colors">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
