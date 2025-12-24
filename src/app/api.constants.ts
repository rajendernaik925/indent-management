export const projectName = 'Indent Management';

export const authUrls = {
  login: '/userlogin',
};

export const masterUrls = {
  division: '/master/userbu',
  plants: '/master/plants',
  materialTypes: '/master/material-types',
  materials: '/master/search/material',
  InitiatorStatus: '/master/indent/filter/status',
  status: '/master/filter/status',
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
  purchaseList: '/purchase/indents',
  removeMaterial: '/purchase/material-disable',
  processIndent: '/purchase/process-indent',
}

export const hodUrls = {
  hodList: '/hod/indents',
  removeMaterial: '/hod/material-disable',
  processIndent: '/hod/process-indent'
}

export const commonUrls = {
  indentFiles: '/common/files',
  indentDetails: '/common/indentdetails',
}

