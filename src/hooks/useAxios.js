// src/hooks/useAxios.js - GÜNCELLE
import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import axiosClient from '../api/axiosClient';

export const METHODS = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete',
  PATCH: 'patch'
};

const useAxios = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const sendRequest = useCallback(async ({ 
    url, 
    method = METHODS.GET, 
    data: body = null, 
    params = null,
    callbackSuccess = null, 
    callbackError = null,
    showErrorToast = true, // YENİ: Hata toast'ı gösterilsin mi?
    showSuccessToast = false, // YENİ: Başarı toast'ı
    successMessage = "İşlem başarılı!",
  }) => {
    
    setLoading(true);
    setError(null);

    try {
      const response = await axiosClient({
        url,
        method,
        data: body,
        params
      });

      setData(response.data);

      if (showSuccessToast) {
        toast.success(successMessage);
      }

      if (callbackSuccess) {
        callbackSuccess(response);
      }

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Bir hata oluştu';
      setError(errorMessage);

      if (showErrorToast) {
        toast.error(errorMessage);
      }

      if (callbackError) {
        callbackError(err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { sendRequest, loading, error, data };
};

export default useAxios;