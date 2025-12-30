// src/redux/actions/wikiActions.js

import axiosClient from '../../api/axiosClient';
import { WIKI_API, WIKI_PAGINATION } from '../../constants/wikiConstants';

// Action Types
export const WIKI_ACTIONS = {
  // Liste
  FETCH_START: 'wiki/FETCH_START',
  FETCH_SUCCESS: 'wiki/FETCH_SUCCESS',
  FETCH_ERROR: 'wiki/FETCH_ERROR',
  
  // Detay
  FETCH_DETAIL_START: 'wiki/FETCH_DETAIL_START',
  FETCH_DETAIL_SUCCESS: 'wiki/FETCH_DETAIL_SUCCESS',
  FETCH_DETAIL_ERROR: 'wiki/FETCH_DETAIL_ERROR',
  CLEAR_DETAIL: 'wiki/CLEAR_DETAIL',
  
  // Filtreler
  SET_CATEGORY: 'wiki/SET_CATEGORY',
  SET_SEARCH: 'wiki/SET_SEARCH',
  SET_PAGE: 'wiki/SET_PAGE',
  SET_SORT: 'wiki/SET_SORT',
  RESET_FILTERS: 'wiki/RESET_FILTERS',
  
  // İstatistik
  FETCH_STATS_SUCCESS: 'wiki/FETCH_STATS_SUCCESS'
};

// ============================================
// THUNK ACTIONS
// ============================================

/**
 * Wiki listesi getir (pagination + filtre destekli)
 */
export const fetchWikiEntries = () => async (dispatch, getState) => {
  const { wiki } = getState();
  const { activeCategory, searchQuery, pagination, sortBy, sortDir } = wiki;
  
  dispatch({ type: WIKI_ACTIONS.FETCH_START });
  
  try {
    let url;
    const params = new URLSearchParams({
      page: pagination.page,
      size: pagination.size,
      sortBy: sortBy,
      sortDir: sortDir
    });
    
    // URL belirleme
    if (searchQuery) {
      // Arama modu
      if (activeCategory) {
        url = `${WIKI_API.CATEGORY_SEARCH(activeCategory)}?q=${encodeURIComponent(searchQuery)}&${params}`;
      } else {
        url = `${WIKI_API.SEARCH}?q=${encodeURIComponent(searchQuery)}&${params}`;
      }
    } else if (activeCategory) {
      // Kategori modu
      url = `${WIKI_API.CATEGORY(activeCategory)}?${params}`;
    } else {
      // Tüm içerikler
      url = `${WIKI_API.LIST}?${params}`;
    }
    
    const response = await axiosClient.get(url);
    
    dispatch({
      type: WIKI_ACTIONS.FETCH_SUCCESS,
      payload: {
        entries: response.data.content,
        pagination: {
          page: response.data.number,
          size: response.data.size,
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements
        }
      }
    });
  } catch (error) {
    dispatch({
      type: WIKI_ACTIONS.FETCH_ERROR,
      payload: error.response?.data?.message || 'Veriler yüklenirken hata oluştu'
    });
  }
};

/**
 * Wiki detay getir (slug ile)
 */
export const fetchWikiDetail = (slug) => async (dispatch) => {
  dispatch({ type: WIKI_ACTIONS.FETCH_DETAIL_START });
  
  try {
    const response = await axiosClient.get(WIKI_API.DETAIL(slug));
    
    dispatch({
      type: WIKI_ACTIONS.FETCH_DETAIL_SUCCESS,
      payload: response.data
    });
  } catch (error) {
    dispatch({
      type: WIKI_ACTIONS.FETCH_DETAIL_ERROR,
      payload: error.response?.data?.message || 'İçerik bulunamadı'
    });
  }
};

/**
 * Kategori sayılarını getir
 */
export const fetchCategoryStats = () => async (dispatch) => {
  try {
    const response = await axiosClient.get(WIKI_API.STATS);
    
    dispatch({
      type: WIKI_ACTIONS.FETCH_STATS_SUCCESS,
      payload: response.data
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
  }
};

/**
 * Türkçe arama
 */
export const searchTurkish = (query) => async (dispatch, getState) => {
  const { wiki } = getState();
  const { pagination } = wiki;
  
  dispatch({ type: WIKI_ACTIONS.FETCH_START });
  
  try {
    const params = new URLSearchParams({
      q: query,
      page: pagination.page,
      size: pagination.size
    });
    
    const response = await axiosClient.get(`${WIKI_API.SEARCH_TURKISH}?${params}`);
    
    dispatch({
      type: WIKI_ACTIONS.FETCH_SUCCESS,
      payload: {
        entries: response.data.content,
        pagination: {
          page: response.data.number,
          size: response.data.size,
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements
        }
      }
    });
  } catch (error) {
    dispatch({
      type: WIKI_ACTIONS.FETCH_ERROR,
      payload: error.response?.data?.message || 'Arama yapılırken hata oluştu'
    });
  }
};

// ============================================
// SYNC ACTIONS
// ============================================

/**
 * Kategori değiştir ve yeniden fetch
 */
export const setCategory = (category) => (dispatch) => {
  dispatch({ type: WIKI_ACTIONS.SET_CATEGORY, payload: category });
  dispatch({ type: WIKI_ACTIONS.SET_PAGE, payload: 0 }); // Sayfa sıfırla
  dispatch(fetchWikiEntries());
};

/**
 * Arama yap
 */
export const setSearch = (query) => (dispatch) => {
  dispatch({ type: WIKI_ACTIONS.SET_SEARCH, payload: query });
  dispatch({ type: WIKI_ACTIONS.SET_PAGE, payload: 0 });
  dispatch(fetchWikiEntries());
};

/**
 * Sayfa değiştir
 */
export const setPage = (page) => (dispatch) => {
  dispatch({ type: WIKI_ACTIONS.SET_PAGE, payload: page });
  dispatch(fetchWikiEntries());
};

/**
 * Sıralama değiştir
 */
export const setSort = (sortBy, sortDir) => (dispatch) => {
  dispatch({ type: WIKI_ACTIONS.SET_SORT, payload: { sortBy, sortDir } });
  dispatch({ type: WIKI_ACTIONS.SET_PAGE, payload: 0 });
  dispatch(fetchWikiEntries());
};

/**
 * Filtreleri sıfırla
 */
export const resetFilters = () => (dispatch) => {
  dispatch({ type: WIKI_ACTIONS.RESET_FILTERS });
  dispatch(fetchWikiEntries());
};

/**
 * Detayı temizle (sayfa değişiminde)
 */
export const clearDetail = () => ({
  type: WIKI_ACTIONS.CLEAR_DETAIL
});
