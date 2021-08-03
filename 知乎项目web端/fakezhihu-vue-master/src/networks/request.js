import axios from "axios"
export default function request(config){
  const instance1 = axios.create({
    baseURL:"http://127.0.0.1:7300/mock/5e9d2657a3ea9a4388b29a06/example/zhihu",
    timeout:5000
  })
  return instance1(config)
}