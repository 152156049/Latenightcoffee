<template>
  <div class="myorder">
    <!-- 头部 -->
    <div class="head">
      <van-nav-bar @click-left="fhiu" title="我的订单" :border="false">
        <template #left>
          <van-icon name="arrow-left" size="30" color="#000" />
        </template>
      </van-nav-bar>
    </div>
    <!-- tag切换栏 -->
    <div class="tab-center">
      <van-tabs v-model="activeName" @click="switchlabel">
        <van-tab title="全部订单" name="1">
          <div class="ordercenter">
            <div class="order_box">
              <div class="ordernumber">
                <div class="numbers">订单号:12345678912345</div>
                <div class="state">待取餐</div>
              </div>
              <div class="address">
                <h3>来自星星的你</h3>
              </div>
              <div class="commodity">
                <div class="commodity-center">
                  <div class="center-left">
                    <img
                      src="http://www.kangliuyong.com:10002/images/product_small/IMG_0378_02p.jpg"
                      alt
                    />
                  </div>
                  <div class="center-right">
                    <p>
                      <span>卡布奇诺</span>
                      <span>￥28.00</span>
                    </p>
                    <p>
                      <span>默认奶油/多糖</span>
                      <span>*1</span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="statistics">
                <div class="statistic-number">
                  <span>2020-08-17 13:18:54</span>
                </div>
                <!-- <div class="statistic-price">
                <span>￥28.00</span>
                </div>-->
                <div class="operation">
                  <span>确认收货</span>
                </div>
              </div>
            </div>
            <div class="order_price">
              <div>
                <span>共计1件商品</span>
              </div>
              <div>
                <span>￥</span>
                <span>28.00</span>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="进行中" name="2">
          <div class="ordercenter">
            <div class="order_box">
              <div class="ordernumber">
                <div class="numbers">订单号:12345678912345</div>
                <div class="state">待取餐</div>
              </div>
              <div class="address">
                <h3>来自星星的你</h3>
              </div>
              <div class="commodity">
                <div class="commodity-center">
                  <div class="center-left">
                    <img
                      src="http://www.kangliuyong.com:10002/images/product_small/IMG_0378_02p.jpg"
                      alt
                    />
                  </div>
                  <div class="center-right">
                    <p>
                      <span>卡布奇诺</span>
                      <span>￥28.00</span>
                    </p>
                    <p>
                      <span>默认奶油/多糖</span>
                      <span>*1</span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="statistics">
                <div class="statistic-number">
                  <span>2020-08-17 13:18:54</span>
                </div>
                <!-- <div class="statistic-price">
                <span>￥28.00</span>
                </div>-->
                <div class="operation">
                  <span>确认收货</span>
                </div>
              </div>
            </div>
            <div class="order_price">
              <div>
                <span>共计1件商品</span>
              </div>
              <div>
                <span>￥</span>
                <span>28.00</span>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="已完成" name="3">
          <div class="ordercenter">
            <div class="order_box">
              <div class="ordernumber">
                <div class="numbers">订单号:12345678912345</div>
                <div class="state">待取餐</div>
              </div>
              <div class="address">
                <h3>来自星星的你</h3>
              </div>
              <div class="commodity">
                <div class="commodity-center">
                  <div class="center-left">
                    <img
                      src="http://www.kangliuyong.com:10002/images/product_small/IMG_0378_02p.jpg"
                      alt
                    />
                  </div>
                  <div class="center-right">
                    <p>
                      <span>卡布奇诺</span>
                      <span>￥28.00</span>
                    </p>
                    <p>
                      <span>默认奶油/多糖</span>
                      <span>*1</span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="statistics">
                <div class="statistic-number">
                  <span>2020-08-17 13:18:54</span>
                </div>
                <!-- <div class="statistic-price">
                <span>￥28.00</span>
                </div>-->
                <div class="operation">
                  <span>确认收货</span>
                </div>
              </div>
            </div>
            <div class="order_price">
              <div>
                <span>共计1件商品</span>
              </div>
              <div>
                <span>￥</span>
                <span>28.00</span>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import "../assets/less/myorder/myorder.less";
export default {
  name: "Myorder",
  data() {
    return {
      activeName: "1",
    };
  },
  created() {},
  methods: {
    // 返回上一层
    fhiu() {
      this.$router.go(-1);
    },
    // 切换标签
    switchlabel(name) {
      // console.log(name);
    },
  },
};
</script>

