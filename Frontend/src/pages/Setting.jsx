import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import api from '../axios/axios';
import { 
  Bell, 
  Palette, 
  Lock,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export default function Settings() {
  const { theme, toggleTheme } = useAuth();

  //? Notification states loaded from localStorage
  const [emailNotify, setEmailNotify] = useState(() => {
    return window.localStorage.getItem("zentask_email_notify") !== "false";
  });
  const [pushNotify, setPushNotify] = useState(() => {
    return window.localStorage.getItem("zentask_push_notify") === "true";
  });
  const [weeklyDigest, setWeeklyDigest] = useState(() => {
    return window.localStorage.getItem("zentask_weekly_digest") !== "false";
  });

  const handleToggleEmail = () => {
    const newVal = !emailNotify;
    setEmailNotify(newVal);
    window.localStorage.setItem("zentask_email_notify", String(newVal));
  };

  const handleTogglePush = () => {
    const newVal = !pushNotify;
    setPushNotify(newVal);
    window.localStorage.setItem("zentask_push_notify", String(newVal));
  };

  const handleToggleDigest = () => {
    const newVal = !weeklyDigest;
    setWeeklyDigest(newVal);
    window.localStorage.setItem("zentask_weekly_digest", String(newVal));
  };

  //! Password forms validation & state
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string()
        .required('Current Password is required'),
      newPassword: Yup.string()
        .min(6, 'New password must be at least 6 characters')
        .required('New password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Confirm password is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      setSaveSuccess(false);
      setErrorMsg("");
      setIsSubmitting(true);
      try {
        const response = await api.post("/user/change-password", {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword
        });
        if (response.data?.success) {
          setSaveSuccess(true);
          resetForm();
          setTimeout(() => setSaveSuccess(false), 4000);
        } else {
          setErrorMsg(response.data?.message || "Failed to update password");
        }
      } catch (error) {
        setErrorMsg(error.response?.data?.message || "Failed to update password. Please check your credentials.");
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight font-display">
          Settings
        </h1>
        <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
          Customize notifications preferences, security parameters, and application look-and-feel.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Navigation/Category Layout on Left */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Notifications Panel */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-premium space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-50 dark:border-slate-850">
              <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-display">Notifications Settings</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">Choose when and how you want to be alerted</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Toggle 1 */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Notifications</span>
                  <p className="text-xs text-slate-405 dark:text-slate-500">Receive summaries, task reports, and milestones alerts.</p>
                </div>
                <button
                  type="button"
                  onClick={handleToggleEmail}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    emailNotify ? 'bg-indigo-600' : 'bg-slate-205 dark:bg-slate-800'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-slate-300 shadow ring-0 transition duration-200 ease-in-out ${
                    emailNotify ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Toggle 2 */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Desktop Push Alerts</span>
                  <p className="text-xs text-slate-405 dark:text-slate-500">Get instant alerts on screen when due dates approach.</p>
                </div>
                <button
                  type="button"
                  onClick={handleTogglePush}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    pushNotify ? 'bg-indigo-600' : 'bg-slate-205 dark:bg-slate-800'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-slate-300 shadow ring-0 transition duration-200 ease-in-out ${
                    pushNotify ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Toggle 3 */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Weekly Progress Digest</span>
                  <p className="text-xs text-slate-405 dark:text-slate-500">Receive a weekly productivity report on Sunday evening.</p>
                </div>
                <button
                  type="button"
                  onClick={handleToggleDigest}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    weeklyDigest ? 'bg-indigo-600' : 'bg-slate-205 dark:bg-slate-800'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-slate-300 shadow ring-0 transition duration-200 ease-in-out ${
                    weeklyDigest ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Account Security Password Reset */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-premium space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-50 dark:border-slate-850">
              <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-display">Security Settings</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">Update password details for account security</p>
              </div>
            </div>

            {saveSuccess && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-lg flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Password updated successfully!</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900 text-red-700 dark:text-red-400 text-xs font-semibold rounded-lg flex items-center gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                placeholder="••••••••"
                name="oldPassword"
                value={formik.values.oldPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.oldPassword && formik.errors.oldPassword}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="New Password"
                  type="password"
                  placeholder="••••••••"
                  name="newPassword"
                  value={formik.values.newPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.newPassword && formik.errors.newPassword}
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="••••••••"
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.confirmPassword && formik.errors.confirmPassword}
                />
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" size="sm" disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Change Password"}
                </Button>
              </div>
            </form>
          </div>

        </div>

        {/* Side Preferences Column */}
        <div className="space-y-6">
          {/* Theme Preferences */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-premium space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Palette className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-display">Theme Preference</h3>
            </div>
            
            <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
              Select your workspace theme. Preference is automatically saved to Local Storage.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Light card */}
              <button 
                type="button" 
                onClick={() => theme === 'dark' && toggleTheme()}
                className={`flex-1 py-3 px-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'border-indigo-600 bg-indigo-50/10'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 bg-white dark:bg-slate-850'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 shadow-xs flex items-center justify-center text-xs font-bold text-slate-700">Ab</div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Light</span>
              </button>

              {/* Dark card */}
              <button 
                type="button" 
                onClick={() => theme === 'light' && toggleTheme()}
                className={`flex-1 py-3 px-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'border-indigo-600 bg-indigo-950/10'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 bg-white dark:bg-slate-850'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 shadow-xs flex items-center justify-center text-xs font-bold text-slate-400">Ab</div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Dark</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}