export const projectName = 'Indent Management';

export const authUrls = {
  login: '/userlogin',
};

export const masterUrls = {
  division: '/master/userbu',
  plants: '/master/plants',
  materialTypes: '/master/material-types',
  materials: '/master/search/material',
};

export const employeeUrls = {
  raiseIndentRequest: '/initiator/raise-indent',
  indentRequestLIst: '/initiator/indents',
  removeMaterial: '/initiator/material-disable'
}

export const managerUrls = {
  managerList: '/manager/indents',
  removeMaterial: '/manager/material-disable',
  processIndent: '/manager/process-indent'
}

export const purchaseUrls = {
  purchaseList: '/manager/indents',
  removeMaterial: '/purchase/material-disable'
}

export const hodUrls = {
  hodList: '/manager/indents',
  removeMaterial: '/hod/material-disable'
}

export const commonUrls = {
  indentFiles: '/common/files',
  indentDetails: '/common/indentdetails',
}

