/**
 * سرویس تشخیص عملکرد دستگاه
 * این سرویس با استفاده از چندین روش مختلف، قدرت پردازشی دستگاه کاربر را تخمین می‌زند
 * و تعیین می‌کند که آیا باید از نسخه بهینه‌شده کامپوننت‌ها استفاده کرد یا خیر
 */

export interface PerformanceResult {
  isLowEndDevice: boolean;
  score: number;
  details: {
    cpuCores: number;
    memory?: number;
    deviceMemory?: number;
    hardwareConcurrency?: number;
    devicePixelRatio: number;
    isReducedMotion: boolean;
    isDataSaverEnabled?: boolean;
    frameDuration?: number;
  };
}

// آستانه نمره برای دستگاه‌های ضعیف
const LOW_PERFORMANCE_THRESHOLD = 50;

// تنظیمات تست برای تشخیص عملکرد
const FRAME_TEST_COUNT = 5;
const FRAME_TEST_DURATION = 500; // میلی‌ثانیه

/**
 * اجرای تست فریم‌ریت برای تخمین عملکرد پردازنده
 * @returns زمان متوسط هر فریم به میلی‌ثانیه
 */
const runFrameRateTest = (): Promise<number> => {
  return new Promise((resolve) => {
    let frameCount = 0;
    let totalTime = 0;
    let lastTime = performance.now();
    
    const measureFrame = () => {
      const now = performance.now();
      const frameDuration = now - lastTime;
      totalTime += frameDuration;
      lastTime = now;
      frameCount++;
      
      if (frameCount < FRAME_TEST_COUNT) {
        requestAnimationFrame(measureFrame);
      } else {
        const averageFrameDuration = totalTime / frameCount;
        resolve(averageFrameDuration);
      }
    };
    
    // اجرای یک عملیات سنگین برای تست پردازنده
    const startStressTest = () => {
      const iterations = 5000;
      const arr = new Array(iterations);
      
      for (let i = 0; i < iterations; i++) {
        arr[i] = Math.sqrt(i * 10000) * Math.cos(i) + Math.sin(i);
      }
      
      requestAnimationFrame(measureFrame);
    };
    
    startStressTest();
  });
};

/**
 * بررسی آیا حالت Data Saver فعال است
 * @returns آیا حالت Data Saver فعال است
 */
const isDataSaverEnabled = (): boolean => {
  const nav = navigator as any;
  return !!(nav.connection && nav.connection.saveData);
};

/**
 * بررسی آیا کاربر تنظیمات کاهش حرکت را فعال کرده است
 * @returns آیا تنظیمات کاهش حرکت فعال است
 */
const isReducedMotionEnabled = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * تخمین حافظه دستگاه
 * @returns مقدار تخمینی حافظه به گیگابایت
 */
const estimateDeviceMemory = (): number => {
  const nav = navigator as any;
  if (nav.deviceMemory) {
    return nav.deviceMemory;
  }
  
  // تخمین بر اساس تعداد هسته‌های پردازنده
  const cores = navigator.hardwareConcurrency || 2;
  return cores <= 2 ? 2 : cores <= 4 ? 4 : 8;
};

/**
 * محاسبه امتیاز عملکرد بر اساس چندین فاکتور مختلف
 * امتیاز بالاتر = دستگاه قوی‌تر
 * @param details جزئیات عملکرد دستگاه
 * @returns امتیاز عملکرد بین 0 تا 100
 */
const calculatePerformanceScore = (details: PerformanceResult['details']): number => {
  let score = 0;
  
  // امتیاز بر اساس تعداد هسته‌های پردازنده
  const coreScore = Math.min(details.cpuCores * 10, 40);
  score += coreScore;
  
  // امتیاز بر اساس حافظه دستگاه (اگر در دسترس باشد)
  if (details.deviceMemory) {
    const memoryScore = Math.min(details.deviceMemory * 5, 25);
    score += memoryScore;
  } else {
    // اگر اطلاعات حافظه در دسترس نباشد، یک امتیاز متوسط در نظر می‌گیریم
    score += 15;
  }
  
  // امتیاز بر اساس نسبت پیکسل دستگاه
  // دستگاه‌های با نسبت پیکسل بالاتر معمولاً قوی‌تر هستند، اما رندر سنگین‌تری دارند
  const dprScore = Math.min(details.devicePixelRatio * 5, 15);
  score += dprScore;
  
  // کاهش امتیاز برای حالت‌های ذخیره داده و کاهش حرکت
  if (details.isDataSaverEnabled) {
    score -= 15;
  }
  
  if (details.isReducedMotion) {
    score -= 10;
  }
  
  // اگر نتیجه تست فریم‌ریت موجود باشد، از آن استفاده می‌کنیم
  if (details.frameDuration) {
    // فریم‌ریت پایین‌تر = امتیاز کمتر
    // 16ms = 60fps (امتیاز بالا)، 32ms = 30fps (امتیاز متوسط)، 50ms+ = امتیاز پایین
    const fpsScore = Math.max(0, 20 - (details.frameDuration - 16) / 2);
    score += fpsScore;
  }
  
  // نرمال‌سازی امتیاز بین 0 تا 100
  return Math.max(0, Math.min(100, score));
};

/**
 * سنجش عملکرد دستگاه و تعیین استفاده از نسخه بهینه‌شده
 * @returns نتیجه سنجش عملکرد
 */
export const detectPerformance = async (): Promise<PerformanceResult> => {
  // جمع‌آوری اطلاعات اولیه دستگاه
  const cpuCores = navigator.hardwareConcurrency || 2;
  const devicePixelRatio = window.devicePixelRatio || 1;
  const isReducedMotion = isReducedMotionEnabled();
  const nav = navigator as any;
  
  // اجرای تست فریم‌ریت
  let frameDuration;
  try {
    frameDuration = await runFrameRateTest();
  } catch (error) {
    console.warn('Frame rate test failed:', error);
  }
  
  // جمع‌آوری تمام اطلاعات در یک آبجکت
  const details: PerformanceResult['details'] = {
    cpuCores,
    devicePixelRatio,
    isReducedMotion,
    isDataSaverEnabled: isDataSaverEnabled(),
    hardwareConcurrency: nav.hardwareConcurrency,
    deviceMemory: nav.deviceMemory,
    frameDuration
  };
  
  // محاسبه امتیاز عملکرد
  const score = calculatePerformanceScore(details);
  
  // تعیین نوع دستگاه بر اساس امتیاز
  const isLowEndDevice = score < LOW_PERFORMANCE_THRESHOLD;
  
  return {
    isLowEndDevice,
    score,
    details
  };
};

// Cache نتیجه تشخیص برای جلوگیری از محاسبه مجدد
let cachedResult: PerformanceResult | null = null;

/**
 * سنجش عملکرد دستگاه با استفاده از cache
 * @returns نتیجه سنجش عملکرد
 */
export const getDevicePerformance = async (): Promise<PerformanceResult> => {
  if (cachedResult) {
    return cachedResult;
  }
  
  cachedResult = await detectPerformance();
  return cachedResult;
};

/**
 * بررسی سریع آیا دستگاه کاربر ضعیف است
 * این تابع اطلاعات مقدماتی را بدون اجرای تست‌های سنگین بررسی می‌کند
 * @returns آیا دستگاه ضعیف است
 */
export const isLowEndDeviceQuickCheck = (): boolean => {
  // بررسی موبایل بودن
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // بررسی تعداد هسته‌های پردازنده
  const hasLowCores = (navigator.hardwareConcurrency || 4) <= 2;
  
  // بررسی حافظه دستگاه
  const nav = navigator as any;
  const hasLowMemory = nav.deviceMemory && nav.deviceMemory <= 2;
  
  // بررسی حالت ذخیره داده
  const hasSaveData = !!(nav.connection && nav.connection.saveData);
  
  // بررسی کاهش حرکت
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // برگرداندن نتیجه سریع بر اساس ترکیبی از شرایط
  return (isMobile && hasLowCores) || hasLowMemory || hasSaveData || prefersReducedMotion;
}; 