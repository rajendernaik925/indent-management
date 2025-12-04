export const projectName = 'indent-management';

export const authUrls = {
  login: '/userlogin',
  userDetail: '/auth/user-detail',
  otp:'/auth/otp',
  register:'/auth/register',
  mobileLogin:'/auth/mobile-login',
  forgotPassword:'/auth/forgot-password',
  resetPassword:'/auth/reset-password',
  confirmReset:'/auth/confirm-reset'
};

export const moduleUrls = {
  allJobs:'/api/job-posts',
  patientList: '/api/patients',
  patientCreate: `/api/patients`,
  patientUpdate: `/api/patient`,
  getPatientById:'/api/patient',
  clinicList: `/api/clinics`,
  clinic: '/api/clinic',
  clinicsAutocomplete: '/api/clinics-autocomplete',
  patientsExport: '/api/export-patient-records',
  billGenerate: '/api/bill-generate',
}

export const masterUrls = {
  allJobs:'/master/materialType',
  materialCode:'/master/materialCode',
  materialGroup:'/master/materialGroup',
  materialCategory:'/master/materialCategory',
}

