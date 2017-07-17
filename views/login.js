import React from 'react';
import {
  AppRegistry,
  Text,
  Button,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity
} from 'react-native';

import { LoginManager, AccessToken } from 'react-native-fbsdk';
import firebase from '../firebase';

import Constants from '../contants';

class Login extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    };

    firebase.database().ref('users').on('value', snapshot => {
      const value = snapshot.val();
      console.log('users', value);
    });
  }

  signup() {
    this.props.navigation.navigate('SignUp');
  }

  login() {
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .catch(error => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
  }

  facebookLogin() {
    LoginManager.logInWithReadPermissions(['public_profile']).then(
      result => {
        console.log(result);
        if (result.isCancelled) {
          alert('Login cancelled');
        } else {
          alert('Login success with permissions: ' + result.grantedPermissions.toString());

          AccessToken.getCurrentAccessToken().then(data => {
            alert(data.accessToken.toString());
          });
        }
      },
      error => {
        alert('Login fail with error: ' + error);
      }
    );
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <View style={styles.form}>
          <Text style={styles.label}>E-mail</Text>
          <View style={styles.inputArea}>
            <TextInput
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              onChangeText={email => this.setState({ email })}
              value={this.state.email}
            />
          </View>
          <Text style={styles.label}>Senha</Text>
          <View style={styles.inputArea}>
            <TextInput
              secureTextEntry={true}
              style={styles.input}
              onChangeText={password => this.setState({ password })}
              value={this.state.password}
            />
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              color="#000"
              style={{ marginTop: 10 }}
              onPress={this.signup.bind(this)}
            >
              <Text>Cadastre-se</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              color="#FFF"
              disabled={this.state.loading}
              onPress={this.login.bind(this)}
            >
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.buttonFB} onPress={() => this.facebookLogin()}>
            <Text style={styles.buttonText}>Entrar com Facebook</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Constants.colors.blue
  },
  logo: {
    width: 250,
    height: 248 / (658 / 250),
    marginVertical: 40,
    resizeMode: 'stretch',
    alignSelf: 'center'
  },
  form: {
    margin: 20,
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#FFF',
    flex: 1,
    alignSelf: 'flex-end'
  },
  label: {
    color: Constants.colors.orange
  },
  inputArea: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Constants.colors.orange
  },
  input: {
    height: 40
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    borderRadius: 4,
    padding: 10,
    paddingHorizontal: 30,
    backgroundColor: Constants.colors.orange
  },
  buttonFB: {
    backgroundColor: Constants.colors.dark,
    borderRadius: 5,
    padding: 10,
    marginTop: 20
  },
  buttonFBArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFF'
  },
  buttonTextFB: {
    textAlign: 'center',
    color: '#FFF',
    marginLeft: 10
  },
  link: {
    fontSize: 12
  }
});

module.exports = Login;
