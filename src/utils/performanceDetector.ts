/**
 * Quick check to determine if the device is low-end based on basic criteria
 * @returns boolean indicating if the device is considered low-end
 */
export const isLowEndDeviceQuickCheck = (): boolean => {
  // Check if device is mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Check CPU cores
  const hasLowCores = (navigator.hardwareConcurrency || 4) <= 2;
  
  // Check device memory
  const nav = navigator as any;
  const hasLowMemory = nav.deviceMemory && nav.deviceMemory <= 2;
  
  // Check data saver mode
  const hasSaveData = !!(nav.connection && nav.connection.saveData);
  
  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Return quick result based on combination of conditions
  return (isMobile && hasLowCores) || hasLowMemory || hasSaveData || prefersReducedMotion;
};