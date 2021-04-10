<template>
  <div id="emailHandler">
      This is email handler
  </div>
</template>

<script>
export default {
 name: 'EmailHandler',
 data(){
     return{
         oobCode: "",
         apiKey: "",
         isVerifyEmail: false,
         isResetPassword: false,
     }
 },

 methods: {
     verifyEmail(){
         this.isVerifyEmail = true;
         this.isResetPassword = false;

       
     },

     resetPassword(){
         this.isResetPassword = true;
         this.isVerifyEmail = false;
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
             break;
        case "recoverEmail":
             break;
     }
 },
}
</script>

<style>

</style>