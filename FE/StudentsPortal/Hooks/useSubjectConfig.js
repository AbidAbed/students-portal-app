import notEmptyValidator from './Validators/notEmptyValidator';
import numberValidator from './Validators/numberValidator';

function useSubjectConfig() {
  return [
    {
      labelText: 'Subject name',
      type: 'name',
      validator: notEmptyValidator,
      placeholder: 'subject name',
      isSecure: false,
      keyboardType: 'default',
    },
    {
      labelText: 'Pass mark',
      type: 'passmark',
      validator: numberValidator,
      placeholder: 'pass mark',
      isSecure: false,
      keyboardType: 'numeric',
    },
  ];
}
export default useSubjectConfig;
