const USER_API = {
  userList: {
    method: 'get',
    url: '/user/findAll'
  },
  usersInfo: {
    method: 'get',
    url: '/user/findAllName'
  },
  addUser: {
    method: 'post',
    url: '/user/add'
  },
  delUser: {
    method: 'post',
    url: '/user/remove'
  },
  editUser: {
    method: 'post',
    url: '/user/edit'
  },
  showUser: {
    method: 'get',
    url: '/user/findById'
  }
}

export default USER_API
