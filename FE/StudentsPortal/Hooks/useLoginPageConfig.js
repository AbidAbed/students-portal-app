import emailValidator from './Validators/emailValidator';
import passwordValidator from './Validators/passwordValidator';

function useLoginPageConfig() {
  return [
    {
      labelText: 'Email',
      type: 'email',
      validator: emailValidator,
      placeholder: 'email@gmail.com',
      isSecure: false,
      keyboardType:'email-address'
    },
    {
      labelText: 'Password',
      type: 'password',
      validator: passwordValidator,
      placeholder: 'P@2ssword',
      isSecure: true,
      keyboardType:'default'
    },
  ];
}
export default useLoginPageConfig;
