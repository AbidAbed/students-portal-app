import {useEffect, useReducer, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import useFormRedConfig from '../Hooks/useFormRedConfig';

function reducer(state, action) {
  return {
    ...state,
    [action.type]: action.payload,
  };
}
function Form({
  config,
  onSubmit,
  submitButtonTitle,
  responseError,
  buttonIcon,
  buttonStyle,
  children,
  formStyle,
  submitButtonTitleStyle,
  setResponseError,
  doValidation,
  dissAllowButton,
}) {
  const reducerConfig = useFormRedConfig(config);
  const [state, dispatch] = useReducer(reducer, reducerConfig);

  const [errors, setErrors] = useState();

  useEffect(() => {
    if (responseError === '') setErrors('');
    else setErrors(responseError);
  }, [responseError]);

  function handleStateChange(type, value, validator) {
    dispatch({type, payload: value});
    let validation = handleValidation(type, value, validator);
    if (!validation || validation === '') {
      setResponseError('');
      setErrors();
    } else {
      setResponseError(validation);
      setErrors(validation);
    }
  }

  function handleValidation(type, value, validator) {
    let validation = '';
    if (type === 'repPassword') {
      validation = validator(type, value, state['password']);
    } else validation = validator(type, value);
    return validation;
  }
  const renderedForm = config.map(element => {
    return (
      <View style={styles.elementContainer} key={element.type}>
        <Text style={element.labelStyle || styles.labelForm}>
          {element.labelText}
        </Text>
        <TextInput
          value={state[element.type]}
          onChangeText={text =>
            handleStateChange(element.type, text, element.validator)
          }
          keyboardType={element.keyboardType}
          secureTextEntry={element.isSecure}
          style={element.inputStyle || styles.inputForm}
          placeholder={element.placeholder}
          editable={element.disabled ? false : true}></TextInput>
      </View>
    );
  });

  return (
    <ScrollView style={[styles.formContainer, formStyle && {...formStyle}]}>
      {renderedForm}
      {children}
      <View style={styles.errorFormContainer}>
        <Text style={styles.errorText}>
          {responseError ? responseError : errors}
        </Text>
      </View>
      <View style={styles.errorFormContainer}>
        {dissAllowButton ? (
          ''
        ) : (
          <TouchableOpacity
            style={[
              styles.submitButtonContainer,
              buttonStyle && {...buttonStyle},
            ]}
            onPress={() => {
              const validation = config.reduce((prevEntry, currentEntry) => {
                const error = handleValidation(
                  currentEntry.type,
                  state[currentEntry.type],
                  currentEntry.validator,
                );
                if (error === '') return prevEntry;
                else {
                  if (prevEntry === '') {
                    return error;
                  } else return prevEntry + ' , ' + error;
                }
              }, '');
              if (doValidation) {
                if (validation.replaceAll(',') === '') {
                  onSubmit(state);
                  setErrors('');
                } else {
                  setErrors(validation);
                }
              } else {
                onSubmit(state, validation);
              }
            }}>
            {buttonIcon}
            <Text
              style={
                submitButtonTitleStyle
                  ? submitButtonTitleStyle
                  : styles.submitButtonTitle
              }>
              {submitButtonTitle}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  submitButtonTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  submitButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    borderRadius: 8,
    marginBottom: '20%',
    height: '10%',
    padding: '5%',
    flexDirection: 'row',
  },
  elementContainer: {
    flex: 1,
    flexDirection: 'center',
    padding: '1%',
    justifyContent: 'center',
    alignContent: 'center',
  },
  labelForm: {
    color: 'black',
    alignContent: 'center',
    justifyContent: 'center',
    padding: '5%',
    fontSize: 20,
    fontWeight: 'bold',
  },
  errorText: {color: 'red', margin: '2%'},
  errorFormContainer: {
    flex: 1,
    padding: '1%',
  },
  formContainer: {
    flex: 1,
    alignContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: '10%',
  },

  inputForm: {
    borderColor: 'black',
    borderRadius: 15,
    height: '50%',
    borderWidth: 2,
    color: 'black',
    textAlign: 'center',
  },
});
export default Form;
