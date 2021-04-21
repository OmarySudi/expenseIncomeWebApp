<template>
  <v-container>
      <v-row justify="center" align="center">
          <v-col cols="12" sm="4">
                 <div class="text-center">
                    <v-dialog
                    v-model="dialog"
                    width="500"
                    >

                        <v-card>
                           
                             <v-alert :type="alertType">
                                 {{dialogTitle}}
                             </v-alert>
                           
                            <v-card-text>
                                {{emailVerifyMessage }}
                            </v-card-text>

                            <v-divider></v-divider>

                            <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                color="primary"
                                text
                                @click="closeDialog()"
                            >
                                OK
                            </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                   
                </div>

                 <v-card v-show="isResetPassword" class="text-center">
                        <v-card-subtitle class="headline blue light-3 white--text">
                            Reset Password
                        </v-card-subtitle>
                        <v-card-text>
                            <v-text-field
                                ref="password"
                                :append-icon="(showPassword?'mdi-eye-off':'mdi-eye')"
                                @click:append="toggleShowPassword()"
                                :type="(showPassword?'text':'password')"
                                label="Password"
                                v-model.trim="password"
                                :error-messages="passwordErrors" 
                                :error-count="5"
                                required
                                @input="$v.password.$touch()"
                                @blur="$v.password.$touch()"
                            >

                            </v-text-field>
                            <v-text-field
                                ref="password"
                                :type="(showPassword?'text':'password')"
                                label="Confirm Password"
                                v-model.trim="confirmPassword"
                                :error-messages="passwordConfirmErrors"
                                :error-count="5" 
                                required
                                @input="$v.confirmPassword.$touch()"
                                @blur="$v.confirmPassword.$touch()"
                            >

                            </v-text-field>
                        </v-card-text>
                        <v-row justify="center" align="center">
                            <v-col cols="12">
                                <v-btn
                                    width="150"
                                    color="primary"
                                    @click.prevent="doPasswordReset()"
                                    :disabled="disableResetButton()"
                                >
                                    RESET
                                </v-btn>
                            </v-col>
                        </v-row>
                        <!-- <v-row class="mt-3">
                            <v-col cols="12">
                                <v-alert type="warning" v-model="resetError">
                                    {{ resetErrorMessage }}
                                </v-alert>
                            </v-col>
                        </v-row> -->
                </v-card>
          </v-col>
      </v-row>
  </v-container>
</template>

<script>
import {auth} from '../firebase'
import {required,minLength} from 'vuelidate/lib/validators'
/* eslint-disable */ 
export default {
 name: 'EmailHandler',
 data(){
     return{
        oobCode: "",
        apiKey: "",
        isResetPassword: false,
        dialog: false,
        emailVerifyMessage:"",
        alertType: "",
        resetError: false,
        resetErrorMessage:'',
        showPassword: false,
        dialogTitle:'',
        password:'',
        confirmPassword: '',
        userEmail:''
     }
 },

 validations:{
      password:{required,minLength: minLength(8)},
      confirmPassword:{required},
 },

computed:{
     passwordErrors() {
          
            const errors = [];
            if (!this.$v.password.$dirty) return errors;
            !this.$v.password.required && errors.push('Password is required');
            !this.$v.password.minLength &&
                errors.push('Password must have 8+ characters');
            !/(?=.*[A-Z])/.test(this.password) &&
                errors.push('Must have one uppercase character');
            !/(?=.*\d)/.test(this.password) &&
                errors.push('Must have one number');
            // !/([!@$%])/.test(this.password) &&
            //     errors.push('Must have one special character [!@#$%]');
            return errors;
    },

    passwordConfirmErrors() {
        const errors = [];
        if (!this.$v.confirmPassword.$dirty) return errors;
        !this.$v.confirmPassword.required && errors.push('Password confirmation is required');
        this.password.localeCompare(this.confirmPassword) !== 0 && errors.push('Must match the original password')
        return errors;
    },
},

 methods: {
     verifyEmail(){
         this.isResetPassword = false;
         
          auth.applyActionCode(this.oobCode).then(()=>{
              this.emailVerifyMessage = "Your email has been successfully verified. click OK to login"
              this.dialogTitle = "Email Verification"
              this.alertType = "success"
              this.dialog = true;
          }).catch((error)=>{
              this.emailVerifyMessage = error.message+" click OK to request a verification link";
              this.dialogTitle = "Email Verification"
              this.alertType = "warning"
              this.dialog = true;
          })
     },

     resetPassword(){
          // Verify the password reset code is valid.
        auth.verifyPasswordResetCode(this.oobCode).then((email)=>{

            this.dialog = false;
            this.isResetPassword = true;
            this.userEmail = email;
        }).catch((error)=>{
            this.emailVerifyMessage = error.message+" Click OK to request to start again";
            this.dialogTitle = "Password Reset"
            this.alertType = "warning"
            this.dialog = true;
        })
         
     },

     doPasswordReset(){
        auth.confirmPasswordReset(this.oobCode,this.password).then((resp)=>{

            console.log(resp);
            this.isResetPassword = false;
            this.dialogTitle = "Password Reset"
            this.alertType = "success"
            this.emailVerifyMessage = "You have been successfully resetted your password. Click OK to login"
            this.dialog = true;

        }).catch((error)=>{

            console.log(error);
            this.isResetPassword = false;
            this.emailVerifyMessage = error.message+" click 0K to start the process";
            this.dialogTitle = "Password Reset"
            this.alertType = "warning"
            this.dialog = true;
        })
     },

     toggleShowPassword(){
         this.showPassword = !this.showPassword;
     },

     disableResetButton(){
        if(
            (this.passwordErrors.length > 0 || this.passwordConfirmErrors.length > 0)
            || (this.password == '' || this.confirmPassword == '')
        )
            return true;
        else
            return false;
     },

     closeDialog(){
        this.dialog = false;
        window.location.href = "https://expenseincome.page.link/redirect";
     }

 },

 created(){
    
    this.oobCode = this.$route.query.oobCode;
    this.apiKey = this.$route.query.apiKey;

     switch(this.$route.query.mode){
        case "verifyEmail":
                this.verifyEmail();
             break;
        case "resetPassword":
                this.resetPassword();
             break;
        case "recoverEmail":
             break;
     }
 },
}
</script>

<style>

</style>