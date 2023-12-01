import emailValidator from './Validators/emailValidator';
import notEmptyValidator from './Validators/notEmptyValidator';

function useStudentDashboardConfig(user) {
  return [
    {
      labelText: 'Username',
      type: 'username',
      validator: notEmptyValidator,
      placeholder: `${user.username}`,
      isSecure: false,
      keyboardType: 'default',
      disabled: true,
    },
    {
      labelText: 'Email',
      type: 'email',
      validator: emailValidator,
      placeholder: `${user.email}`,
      isSecure: false,
      keyboardType: 'email-address',
      disabled: true,
    },
  ];
}
export default useStudentDashboardConfig;
