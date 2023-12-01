import emailValidator from './Validators/emailValidator';
import notEmptyValidator from './Validators/notEmptyValidator';

function useUserEditConfig(user) {
  return [
    {
      labelText: `Email`,
      type: 'email',
      validator: emailValidator,
      placeholder: user.email,
      isSecure: false,
    },
    {
      labelText: `Username`,
      type: 'username',
      validator: notEmptyValidator,
      placeholder: user.username,
      isSecure: false,
    },
  ];
}
export default useUserEditConfig;
