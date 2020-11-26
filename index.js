// 引用 line 機器套件
import linebot from 'linebot'

// 引用 dotenv 套件
import dotenv from 'dotenv'

// 引用 axios 套件
import axios from 'axios'
// 引用 node-schedule 套件
import schedule from 'node-schedule'

import https from 'https'

const httpsAgent = new https.Agent({
  rejectUnauthorized: false
})

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

let gym = []
const updataData = async () => {
  const response = await axios.get('https://iplay.sa.gov.tw/api/GymSearchAllList', { httpsAgent })
  gym = response.dat
}
schedule.scheduleJob('* * 0 * * *', () => {
  updataData()
})

updataData()

// 讀取 .env
dotenv.config()

// 設定機器人
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

const distance = (lat1, lon1, lat2, lon2, unit) => {
  if ((lat1 === lat2) && (lon1 === lon2)) {
    return 0
  } else {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
    if (dist > 1) {
      dist = 1
    }
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit === 'K') { dist = dist * 1.609344 }
    if (unit === 'N') { dist = dist * 0.8684 }
    return dist
  }
}

bot.on('message', async event => {
  try {
    const response = await axios.get('https://iplay.sa.gov.tw/api/GymSearchAllList', { httpsAgent })
    gym = response.data
    const text = event.message.text
    const total = []
    const minArry = []

    const userlat = event.message.latitude
    const userlng = event.message.longitude

    console.log(userlat)
    console.log(userlng)
    console.log(text)

    console.log(event.message.type)

    if (event.message.type === 'text') {
      for (const data of gym) {
        if (text === data.Name) {
          console.log(data.Name)
          console.log(data.Address)
          event.reply({
            type: 'location',
            title: data.Name,
            address: data.Address,
            latitude: parseFloat(data.LatLng.substr(0, 16)),
            longitude: parseFloat(data.LatLng.substr(17))

          }
          )
        }
      }
      if (text === '😴😴😴') {
        event.reply([{
          type: 'sticker',
          packageId: 2,
          stickerId: 26
        }, {
          type: 'sticker',
          packageId: 2,
          stickerId: 42
        }])
      } else if (text === '@help') {
        event.reply({
          type: 'text',
          text: '🙇‍♀️有什麼可以幫您的呢',
          quickReply: {
            items: [{
              type: 'action',
              imageUrl: 'https://xxx/image2.png',
              action: {
                type: 'message',
                label: '如何使用❔',
                text: '如何使用❔'
              }
            },
            {
              type: 'message',
              imageUrl: 'https://xxx/image1.png',
              action: {
                type: 'location',
                label: '傳送位置訊息🔎'
              }
            },
            {
              type: 'action',
              imageUrl: 'https://xxx/image2.png',
              action: {
                type: 'message',
                label: '查看建議運動量表🏃‍♀️',
                text: '查看建議運動量表🏃‍♀️'
              }
            }
            ]
          }
        })
      } else if (text === '如何使用❔') {
        event.reply('您好👋\n' + '歡迎使用【動ㄘ動ㄘ-運動場查詢系統】\n' + '使用方法為下：\n' + '❣️打開下方功能表即可傳送位置訊息\n' + '❣️會依照您傳的位置訊息搜尋附近的運動場地\n' + '❣️如有疑問可以搜尋 @help\n')
      } else if (text === '查看建議運動量表🏃‍♀️') {
        event.reply({
          type: 'flex',
          altText: '您不能不知道....',
          contents:
          {
            type: 'bubble',
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: '建議運動量表🏃‍♀️',
                  weight: 'bold',
                  size: 'xxl',
                  margin: 'md'
                },
                {
                  type: 'text',
                  text: 'How much of physical activity is recommended?',
                  color: '#f9cb0d',
                  size: 'xxs'
                },
                {
                  type: 'separator',
                  margin: 'xxl'
                },
                {
                  type: 'box',
                  layout: 'vertical',
                  margin: 'xxl',
                  spacing: 'sm',
                  contents: [
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        {
                          type: 'text',
                          text: '5-17歲的兒童和青少年',
                          size: 'sm',
                          color: '#FA8072',
                          flex: 0,
                          weight: 'bold'
                        }
                      ]
                    },
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        {
                          type: 'text',
                          text: '◎每天至少進行60分鐘中等強度到高強度運動。',
                          size: 'sm',
                          color: '#555555',
                          flex: 0,
                          wrap: true
                        }
                      ]
                    },
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        {
                          type: 'text',
                          text: '◎每週至少三次加強肌肉和骨骼的活動。',
                          size: 'sm',
                          color: '#555555',
                          flex: 0,
                          wrap: true
                        }
                      ]
                    },
                    {
                      type: 'separator',
                      margin: 'xxl'
                    },
                    {
                      type: 'box',
                      layout: 'vertical',
                      margin: 'xxl',
                      spacing: 'sm',
                      contents: [
                        {
                          type: 'box',
                          layout: 'horizontal',
                          contents: [
                            {
                              type: 'text',
                              text: '18-64歲成人',
                              size: 'sm',
                              color: '#FA8072',
                              flex: 0,
                              weight: 'bold'
                            }
                          ]
                        },
                        {
                          type: 'box',
                          layout: 'horizontal',
                          contents: [
                            {
                              type: 'text',
                              text: '◎每週至少150分鐘的中等強度運動，或一周至少75分鐘的高強度運動。',
                              size: 'sm',
                              color: '#555555',
                              flex: 0,
                              wrap: true
                            }
                          ]
                        },
                        {
                          type: 'box',
                          layout: 'horizontal',
                          contents: [
                            {
                              type: 'text',
                              text: '◎每週至少有兩天加強主肌群的活動。',
                              size: 'sm',
                              color: '#555555',
                              flex: 0,
                              wrap: true
                            }
                          ]
                        },
                        {
                          type: 'separator',
                          margin: 'xxl'
                        }
                      ]
                    },
                    {
                      type: 'box',
                      layout: 'vertical',
                      margin: 'xxl',
                      spacing: 'sm',
                      contents: [
                        {
                          type: 'box',
                          layout: 'horizontal',
                          contents: [
                            {
                              type: 'text',
                              text: '65歲以上成人',
                              size: 'sm',
                              color: '#FA8072',
                              flex: 0,
                              weight: 'bold'
                            }
                          ]
                        },
                        {
                          type: 'box',
                          layout: 'horizontal',
                          contents: [
                            {
                              type: 'text',
                              text: '◎每週至少150分鐘的中等強度運動，或一周至少75分鐘的高強度運動。',
                              size: 'sm',
                              color: '#555555',
                              flex: 0,
                              wrap: true
                            }
                          ]
                        },
                        {
                          type: 'box',
                          layout: 'horizontal',
                          contents: [
                            {
                              type: 'text',
                              text: '◎行動不便者每週至少有3天從事運動以加強平衡和防止跌倒。',
                              size: 'sm',
                              color: '#555555',
                              flex: 0,
                              wrap: true
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            footer: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'button',
                  action: {
                    type: 'uri',
                    label: 'SEE MORE',
                    uri: 'https://www.who.int/zh/news-room/fact-sheets/detail/physical-activity'
                  },
                  color: '#f9cb0d'
                }
              ]
            },
            styles: {
              footer: {
                separator: true
              }
            }
          }
        }
        )
      }
    } else if (event.message.type === 'location') {
      for (const data of gym) {
        data.lat = parseFloat(data.LatLng.substr(0, 16))
        data.lng = parseFloat(data.LatLng.substr(17))

        const min = distance(userlat, userlng, data.lat, data.lng, 'k')
        if (min < 1 && !data.OpenState.includes('不開放使用')) {
          total.push({
            data,
            min: parseFloat(Math.round(min * 10 ** 5))
          })
          minArry.push(Math.round(min * 10 ** 5))
        }
      }
      console.log(total.length)
      console.log(total)

      minArry.sort((a, b) => {
        return a - b
      })

      const flex = {
        type: 'flex',
        altText: '幫您找到了...',
        contents:
      {
        type: 'carousel',
        contents: [
        ]
      }
      }

      const reply = []
      if (total.length > 10) {
        for (let i = 0; i < 10; i++) {
          for (const key in total) {
            if (total[key].min === minArry[i]) {
              reply.push(total[key])
            }
          }
        }

        if (reply.length > 10) {
          reply.splice(reply.length, 1)
        }
        console.log(reply)
        console.log(reply.length)

        for (let i = 0; i < reply.length; i++) {
          flex.contents.contents.push({
            type: 'bubble',
            direction: 'ltr',
            // hero: {
            //   type: 'image',
            //   url: reply[i].data.Photo1,
            //   size: 'full',
            //   aspectMode: 'cover',
            //   aspectRatio: '15:10',
            //   align: 'center'
            // },
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'text',
                      text: reply[i].data.Name,
                      size: 'xl',
                      weight: 'bold'
                    }
                  ]
                },
                {
                  type: 'box',
                  layout: 'baseline',
                  contents: [
                    {
                      type: 'text',
                      text: 'Tel',
                      color: '#aaaaaa',
                      size: 'sm',
                      flex: 1
                    },
                    {
                      type: 'text',
                      text: reply[i].data.OperationTel,
                      color: '#5DADE2',
                      size: 'sm',
                      flex: 4
                    }
                  ],
                  offsetTop: 'sm'
                },
                {
                  type: 'box',
                  layout: 'baseline',
                  contents: [
                    {
                      type: 'text',
                      text: 'Place',
                      flex: 1,
                      color: '#aaaaaa',
                      size: 'sm',
                      offsetStart: 'none'
                    },
                    {
                      type: 'text',
                      text: reply[i].data.Address,
                      flex: 4,
                      color: '#666666',
                      size: 'sm',
                      wrap: true
                    }
                  ],
                  offsetTop: 'sm'
                },
                {
                  type: 'box',
                  layout: 'baseline',
                  contents: [
                    {
                      type: 'text',
                      text: 'Sport',
                      flex: 1,
                      size: 'sm',
                      color: '#aaaaaa'
                    },
                    {
                      type: 'text',
                      text: reply[i].data.GymFuncList,
                      flex: 4,
                      size: 'sm',
                      color: '#666666'
                    }
                  ],
                  offsetTop: 'sm'
                }
              ],
              backgroundColor: '#FAF5E9'
            },
            footer: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'button',
                  action: {
                    type: 'uri',
                    label: '◎詳細資料',
                    uri: `https://iplay.sa.gov.tw/gyminfo/index/${reply[i].data.GymID}`
                  },
                  color: '#FA8072',
                  style: 'link',
                  margin: 'none',
                  offsetTop: 'none',
                  offsetBottom: 'none',
                  height: 'sm'
                },
                {
                  type: 'button',
                  action: {
                    type: 'uri',
                    label: '◎位置訊息',
                    uri: 'https://www.google.com.tw/maps/search/' + reply[i].data.Address
                  },
                  color: '#FA8072',
                  style: 'link',
                  offsetTop: 'sm',
                  offsetBottom: 'none',
                  height: 'sm'
                }
              ],
              borderWidth: 'none',
              paddingAll: 'xxl',
              offsetTop: 'none'
            },
            styles: {
              body: {
                backgroundColor: '#FAF5E9'
              },
              footer: {
                backgroundColor: '#FAF5E9'
              }
            }

          })
        }

        console.log(flex.contents.contents)
        console.log(flex.contents.contents.length)
        event.reply([flex, {
          type: 'text',
          text: '是否還需要幫您找找其他...',
          quickReply: {
            items: [
              {
                type: 'message',
                imageUrl: 'https://xxx/image1.png',
                action: {
                  type: 'location',
                  label: '查詢其他運動場🔎'
                }
              }, {
                type: 'action',
                imageUrl: 'https://xxx/image2.png',
                action: {
                  type: 'message',
                  label: '查看建議運動量表🏃‍♀️',
                  text: '查看建議運動量表🏃‍♀️'
                }
              },
              {
                type: 'message',
                imageUrl: 'https://xxx/image1.png',
                action: {
                  type: 'message',
                  label: '不需要',
                  text: '不需要'
                }
              }
            ]
          }
        }])
      } else if (total.length > 0 && total.length <= 10) {
        for (let i = 0; i < total.length; i++) {
          for (const key in total) {
            if (total[key].min === minArry[i]) {
              reply.push(total[key])
            }
          }
        }
        for (let i = 0; i < reply.length; i++) {
          flex.contents.contents.push({
            type: 'bubble',
            direction: 'ltr',
            // hero: {
            //   type: 'image',
            //   url: reply[i].data.Photo1,
            //   size: 'full',
            //   aspectMode: 'cover',
            //   aspectRatio: '15:10',
            //   align: 'center'
            // },
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'text',
                      text: reply[i].data.Name,
                      size: 'xl',
                      weight: 'bold'
                    }
                  ]
                },
                {
                  type: 'box',
                  layout: 'baseline',
                  contents: [
                    {
                      type: 'text',
                      text: 'Tel',
                      color: '#aaaaaa',
                      size: 'sm',
                      flex: 1
                    },
                    {
                      type: 'text',
                      text: reply[i].data.OperationTel,
                      color: '#5DADE2',
                      size: 'sm',
                      flex: 4
                    }
                  ],
                  offsetTop: 'sm'
                },
                {
                  type: 'box',
                  layout: 'baseline',
                  contents: [
                    {
                      type: 'text',
                      text: 'Place',
                      flex: 1,
                      color: '#aaaaaa',
                      size: 'sm',
                      offsetStart: 'none'
                    },
                    {
                      type: 'text',
                      text: reply[i].data.Address,
                      flex: 4,
                      color: '#666666',
                      size: 'sm',
                      wrap: true
                    }
                  ],
                  offsetTop: 'sm'
                },
                {
                  type: 'box',
                  layout: 'baseline',
                  contents: [
                    {
                      type: 'text',
                      text: 'Sport',
                      flex: 1,
                      size: 'sm',
                      color: '#aaaaaa'
                    },
                    {
                      type: 'text',
                      text: reply[i].data.GymFuncList,
                      flex: 4,
                      size: 'sm',
                      color: '#666666'
                    }
                  ],
                  offsetTop: 'sm'
                }
              ],
              backgroundColor: '#FAF5E9'
            },
            footer: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'button',
                  action: {
                    type: 'uri',
                    label: '◎詳細資料',
                    uri: `https://iplay.sa.gov.tw/gyminfo/index/${reply[i].data.GymID}`
                  },
                  color: '#FA8072',
                  style: 'link',
                  margin: 'none',
                  offsetTop: 'none',
                  offsetBottom: 'none',
                  height: 'sm'
                },
                {
                  type: 'button',
                  action: {
                    type: 'uri',
                    label: '◎位置訊息',
                    uri: 'https://www.google.com.tw/maps/search/' + reply[i].data.Address
                  },
                  color: '#FA8072',
                  style: 'link',
                  offsetTop: 'sm',
                  offsetBottom: 'none',
                  height: 'sm'
                }
              ],
              borderWidth: 'none',
              paddingAll: 'xxl',
              offsetTop: 'none'
            },
            styles: {
              body: {
                backgroundColor: '#FAF5E9'
              },
              footer: {
                backgroundColor: '#FAF5E9'
              }
            }

          })
        }
        console.log(flex.contents.contents)
        console.log(flex.contents.contents.length)
        event.reply([flex, {
          type: 'text',
          text: '是否還需要幫您找找其他...',
          quickReply: {
            items: [
              {
                type: 'message',
                imageUrl: 'https://xxx/image1.png',
                action: {
                  type: 'location',
                  label: '查詢其他運動場🔎'
                }
              }, {
                type: 'action',
                imageUrl: 'https://xxx/image2.png',
                action: {
                  type: 'message',
                  label: '查看建議運動量表🏃‍♀️',
                  text: '查看建議運動量表🏃‍♀️'
                }
              },
              {
                type: 'message',
                imageUrl: 'https://xxx/image1.png',
                action: {
                  type: 'message',
                  label: '不需要',
                  text: '不需要'
                }
              }
            ]
          }
        }])
      } else if (total.length === 0) {
        event.reply({
          type: 'text',
          text: 'Oops!!!這附近沒有運動場地，您可以...',
          quickReply: {
            items: [
              {
                type: 'action',
                imageUrl: 'https://xxx/image1.png',
                action: {
                  type: 'location',
                  label: '換個地方查詢🔎'
                }
              },
              {
                type: 'action',
                imageUrl: 'https://xxx/image2.png',
                action: {
                  type: 'message',
                  label: '查看建議運動量表🏃‍♀️',
                  text: '查看建議運動量表🏃‍♀️'
                }
              },
              {
                type: 'action',
                imageUrl: 'https://xxx/image2.png',
                action: {
                  type: 'message',
                  label: '回家睡大頭覺😴',
                  text: '😴😴😴'
                }
              }

            ]
          }
        })
      }
    }
  } catch (error) {
    event.reply('發生錯誤，請稍後在試試...')
  }
})

bot.listen('/', process.env.PORT, () => {
  console.log('機器人已啟動')
})
