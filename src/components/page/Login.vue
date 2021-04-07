<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="username">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="password"
                        v-model="param.password"
                        @keyup.enter.native="submitForm()"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <!--验证码部分-->
                <el-form-item prop="code">
                    <el-row :span="24">
                        <el-col :span="12">
                            <el-input v-model="param.code" auto-complete="off" placeholder="请输入验证码"></el-input>
                        </el-col>
                        <el-col :span="12">
                            <div class="login-code" @click="refreshCode">
                            <!--验证码组件-->
                                <s-identify :identifyCode="identifyCode"></s-identify>
                            </div>
                        </el-col>
                    </el-row>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
                <p class="login-tips">Tips : 用户名和密码随便填。</p>
            </el-form>
        </div>
    </div>
</template>

<script>
import sIdentify from '../common/SIdentify.vue';
import {setSessionStorageItem} from '../../utils/session_storage';
import service from '../../utils/request'
export default {
    data: function() {
        return {
            param: {
                username: 'admin',
                password: '123',
                code: ''
            },
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
            },
            identifyCode: ''
        };
    },
    methods: {
        generateCode() {
            let codeChars = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
                'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
                'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');//候选字符
            for (let i = 0; i < 4; i++ ) {
                //let charNum = Math.floor(Math.random() * 62);//获取随机验证码下标
                let charNum = Math.floor(Math.random() * 10);
                this.identifyCode += codeChars[charNum];//根据下标获取指定字符并拼接
            }
        },
        refreshCode () {
            this.identifyCode = ''
            this.generateCode()
        },
        submitForm() {
            this.$refs.login.validate(valid => {
                if (valid) {
                    if(this.param.code!==this.identifyCode){
                        this.$message.error('验证码错误');
                        this.refreshCode();
                        return false;
                    }
                    /*this.$message.success('登录成功');
                    localStorage.setItem('ms_username', this.param.username);
                    this.$router.push('/');*/
                    service.post('/login',{
                        ygbh: this.param.username,
                        ygmm: this.param.password
                    }).then(res => {
                        if (res.statusCodeValue == 200) {
                            this.$message.success('登录成功');
                            console.log(res);
                            setSessionStorageItem('ms_username',JSON.stringify(res.body));
                            this.$store.commit("setUserInfo", JSON.stringify(res.body));
                            this.$router.push('/');
                        }
                    },err=>{
                        console.log(err)
                    });
                } else {
                    this.$message.error('请输入账号和密码');
                    console.log('error submit!!');
                    return false;
                }
            });
        },
    },
    created() {
       this.generateCode()
    },
    components :{
        sIdentify
    }
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>