import axios from 'axios'
import querystring from 'querystring'

export const API_SERVER_URL = 'http://api.claris.su/main/'

const conf = {
    baseURL: API_SERVER_URL,
    headers: { 'Cache-Control': 'no-cache' },
    timeout: 15000
}

const instance = axios.create(conf)

const onError = (error) => {
  console.log(error)
  if (error.response) {
    console.warn('axios onError', error.response)

    if (error.response.status === 400) {
      throw Error('Не верный логин или пароль')
    } else if (error.response.status > 400) {
      throw Error('При обработке запроса на сервере произошла ошибка, мы ее зафиксировали и уже разбираемся в причинах.')
    }
  } else if (error.request) {
    console.warn('axios onError', error.request)
    throw Error('Сервер недоступен. Проверьте свое интернет-соединение')
  } else {
    console.warn('Error', error.message)
  }
}


const login = (user, password) =>  {
  const body = `grant_type=password&username=${user}&password=${password}`
  const conf = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }}

  return instance.post('/token', body, conf).catch(onError)
}

const addFile = (uri) =>  {
    let bodyFormData = new FormData()
    bodyFormData.append("file", {
      uri: uri,
      type: "image/jpeg", // or photo.type
      name: "MobileApp.jpg"
    });
    return instance.post("/vNext/v1/files", bodyFormData, { headers: {'Content-Type': 'multipart/form-data' }} );
}

const authorize = () => instance.get('/vNext/v1/users/current')
const setAuthHeader = (token) => instance.defaults.headers.authorization = `Bearer ${token}`

const fetchParkingsForCars = () => instance.get(`vNext/v1/parkings?filterBy=Type.Id="4022244917000" `).catch(onError)
const fetchParkingsForGoods = () => instance.get(`/vNext/v1/parkings`).catch(onError)
const fetchAllTickets = companyId => {
return instance.get('vNext/v1/requests?orderBy=number+desc,&filters=NotClosedRequests,RequestsForTenant', conf).catch(onError)
}

const updateTicketStatus = (ticket) => instance.patch(`/vnext/v1/requests/${ticket.id}`, {status: ticket.status})

const addTicket = (ticket) => instance.post('/vNext/v1/requests', ticket).catch(onError)

export default { login, authorize, setAuthHeader,
                 fetchParkingsForCars, fetchParkingsForGoods, fetchAllTickets, updateTicketStatus,
                 addTicket, addFile }
