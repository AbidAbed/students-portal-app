import {Text, TouchableOpacity, StyleSheet} from 'react-native';

function Button({onChange, style, text, children}) {
  return (
    <TouchableOpacity onPress={onChange} style={style}>
      {children}
      <Text style={style.text ? style.text : styles.text}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text: {fontSize: 20, fontWeight: 'bold', color: 'white'},
});
export default Button;
