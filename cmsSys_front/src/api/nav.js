const NAV_API = {
  navFindAll: {
    method: 'get',
    url: '/nav/findAllnotPaging'
  },
  addNav: {
    method: 'post',
    url: '/nav/add'
  },
  delNav: {
    method: 'get',
    url: '/nav/remove'
  },
  showNav: {
    method: 'get',
    url: '/nav/show'
  },
  editNav: {
    method: 'post',
    url: '/nav/edit'
  }
}

export default NAV_API
