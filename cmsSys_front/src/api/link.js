const LINK_API = {
  linkFindAll: {
    method: 'get',
    url: '/link/findAllnotPaging'
  },
  addLink: {
    method: 'post',
    url: '/link/add'
  },
  delLink: {
    method: 'get',
    url: '/link/remove'
  },
  showLink: {
    method: 'get',
    url: '/link/show'
  },
  editLink: {
    method: 'post',
    url: '/link/edit'
  }
}

export default LINK_API
