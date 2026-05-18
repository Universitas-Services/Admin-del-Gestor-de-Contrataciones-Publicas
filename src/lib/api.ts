import { UniversitasAPI } from '@universitas/sdk-global';

export const api = new UniversitasAPI(
  process.env.NEXT_PUBLIC_UNIVERSITAS_SDK_URL ||
    process.env.NEXT_PUBLIC_API_URL!
);
