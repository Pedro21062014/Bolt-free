import { json } from '@remix-run/cloudflare';
import { MODEL_LIST, initializeModelList } from '~/utils/constants';

export async function loader() {
  await initializeModelList();
  return json(MODEL_LIST);
}
