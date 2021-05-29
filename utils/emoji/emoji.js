// utils/emoji/emojiFace.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value: String, // 输入框的值
  },
  
  /**
   * 组件的初始数据
   */
  data: {
    emojis: [],
  },
  
  /**
   * 组件的方法列表
   */
  methods: {
    // 点击表情
    onTapEmoji: function(e) {
      const {
        currentTarget: {
          dataset: {
            emoji
          }
        }
      } = e;
      const {
        value
      } = this.properties;
      this.triggerEvent('clickEmoji', {
        emoji: emoji,
        value: value + emoji
      })
    },
  },
  
  lifetimes: {
    attached: function() {
      const _high = 55357;
      const _low = 56832;
      const _nums = 18;
      const emojis = [];
      for (let i = 0; i < _nums; i++) {
        const U_high = "%u" + _high.toString(16)
        const U_low = "%u" + (_low + i).toString(16)
        emojis.push(unescape(U_high + U_low))
      }
      this.setData({
        emojis
      })
    },
  }
 })