class Utils {
    // 序列化
    queryString(obj) {
        let params = "";
        for (let key in obj) {
            if (key !== "confirmpassword") {
                params += `${key}=${obj[key]}&`;
            }
        }
        return params.slice(0, -1);
    }
}
export const utils = new Utils();