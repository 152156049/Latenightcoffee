import Vue from "vue";
import { Notify } from "vant";
// 全局注册
Vue.use(Notify);

class ValidForm {
    // 表单验证
    valid(obj) {
        for (let key in obj) {
            if (!obj[key].reg.test(obj[key].value)) {
                Notify({
                    type: "warning",
                    message: obj[key].errorMsg,
                });
                // 验证失败
                return false;
            }
        }
        // 验证通过
        return true;
    }
}

export const validForm = new ValidForm();