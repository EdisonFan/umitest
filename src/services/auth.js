// prod-api/auth/tenant/list
import request from '@/utils/request';




export async function list() {
  return request(`/prod-api/auth/tenant/list`, {
    method: 'GET',
  });
}