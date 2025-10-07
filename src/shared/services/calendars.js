import { apiClient } from './api';

/**
 * Calendar service for managing Google Calendar integration
 */
class CalendarService {
  /**
   * Get all calendars for the authenticated user
   */
  async getCalendars(params = {}) {
    const queryParams = new URLSearchParams({
      limit: params.limit || 20,
      offset: params.offset || 0,
      ...(params.isActive !== undefined && { isActive: params.isActive }),
      ...(params.syncEnabled !== undefined && { syncEnabled: params.syncEnabled }),
      ...(params.orderBy && { orderBy: params.orderBy }),
      ...(params.orderDirection && { orderDirection: params.orderDirection }),
    });

    return apiClient.get(`/calendars?${queryParams}`);
  }

  /**
   * Get a specific calendar by ID
   */
  async getCalendarById(calendarId) {
    return apiClient.get(`/calendars/${calendarId}`);
  }

  /**
   * Create a new calendar with Google Calendar integration
   */
  async createCalendar(calendarData) {
    return apiClient.post('/calendars', calendarData);
  }

  /**
   * Update an existing calendar
   */
  async updateCalendar(calendarId, calendarData) {
    return apiClient.put(`/calendars/${calendarId}`, calendarData);
  }

  /**
   * Delete a calendar
   */
  async deleteCalendar(calendarId) {
    return apiClient.delete(`/calendars/${calendarId}`);
  }

  /**
   * Set a calendar as primary
   */
  async setPrimaryCalendar(calendarId) {
    return apiClient.post(`/calendars/${calendarId}/set-primary`);
  }

  /**
   * Sync a calendar with Google Calendar
   */
  async syncCalendar(calendarId) {
    return apiClient.post(`/calendars/${calendarId}/sync`);
  }

  /**
   * Get Google OAuth authorization URL
   * Returns: { authUrl: string, state: string }
   */
  async getOAuthAuthorizationUrl() {
    return apiClient.get('/calendar-oauth/google/authorize');
  }

  /**
   * Handle OAuth callback - exchange code for tokens
   * @param {string} code - Authorization code from Google
   * @param {string} state - State token for CSRF protection
   * Returns: { calendars: Calendar[] }
   */
  async handleOAuthCallback(code, state) {
    return apiClient.post('/calendar-oauth/google/callback', { code, state });
  }

  /**
   * Sync all user calendars
   */
  async syncAllCalendars() {
    return apiClient.post('/calendar-oauth/sync');
  }

  /**
   * Sync a specific calendar by ID
   */
  async syncSpecificCalendar(calendarId) {
    return apiClient.post(`/calendar-oauth/sync/${calendarId}`);
  }

  /**
   * Disconnect Google Calendar - revoke access and deactivate calendars
   */
  async disconnectGoogleCalendar() {
    return apiClient.post('/calendar-oauth/google/disconnect');
  }
}

export const calendarService = new CalendarService();
export default CalendarService;
