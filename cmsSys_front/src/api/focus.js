const FOCUS_API = {
  focusFindAll: {
    method: 'get',
    url: '/focus/findAllnotPaging'
  },
  addFocus: {
    method: 'post',
    url: '/focus/add'
  },
  delFocus: {
    method: 'post',
    url: '/focus/remove'
  },
  showFocus: {
    method: 'get',
    url: '/focus/findById'
  },
  editFocus: {
    method: 'post',
    url: '/focus/edit'
  }
}

export default FOCUS_API
