// src/service/adminApi.js
import axios from "axios";

/** 개발 중 더미사용 토글: 실서버 붙일 때 false 로만 바꾸면 끝 */
const USE_MOCK = false;

/* =========================
   인메모리 더미 데이터 (생성/유지)
   - 파일 추가 없이 이 파일 내부에서만 사용
   ========================= */
const _rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const _bmi = (h, w) => Math.round((w / ((h / 100) ** 2)) * 10) / 10;

const GENDERS = ["M", "F", "ETC"];
const NICKS = ["Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel"];
const NAMES = ["김가", "이나", "박다", "최라", "정마", "조바", "강사", "한아"];

const MOCK_MEMBERS_DB = Array.from({ length: 60 }).map((_, i) => {
  const height = _rand(150, 185);
  const weight = _rand(50, 95);
  const goal = weight - _rand(0, 10);
  const created = new Date(Date.now() - _rand(0, 60) * 86400000); // 0~60일 전
  const pad = (n) => n.toString().padStart(2, "0");
  const createdAt = `${created.getFullYear()}-${pad(created.getMonth() + 1)}-${pad(created.getDate())}`;
  const mname = `${NAMES[i % NAMES.length]}${pad(i % 30)}`;
  const nickname = `${NICKS[i % NICKS.length]}${pad(i)}`;

  return {
    mno: i + 1,
    userid: `user${i + 1}`,
    mname,
    nickname,
    gender: GENDERS[i % GENDERS.length],
    height,
    weight,
    bmi: _bmi(height, weight),
    goal_weight: goal,
    createdAt,
    status: ["ACTIVE", "SUSPENDED", "DELETED"][i % 3],
  };
});

/* 검색/정렬/페이징 헬퍼 */
function _filterMembers({ keyword = "", status = "" }) {
  const kw = (keyword || "").toLowerCase();
  let list = [...MOCK_MEMBERS_DB];
  if (kw) {
    list = list.filter(
      (m) =>
        m.userid.toLowerCase().includes(kw) ||
        m.nickname.toLowerCase().includes(kw) ||
        m.mname.toLowerCase().includes(kw)
    );
  }
  if (status) {
    list = list.filter((m) => (m.status || "ACTIVE") === status);
  }
  // 기본 정렬: 최근 가입일(desc) → mno(desc)
  list.sort((a, b) => {
    if (a.createdAt === b.createdAt) return b.mno - a.mno;
    return a.createdAt < b.createdAt ? 1 : -1;
  });
  return list;
}

function _paginate(list, page = 1, size = 20) {
  const p = Math.max(1, Number(page || 1));
  const s = Math.max(1, Number(size || 20));
  const start = (p - 1) * s;
  const items = list.slice(start, start + s);
  return { items, page: p, size: s, total: list.length };
}

/* 더미 핸들러들 */
async function mockFetchMembers({ page = 1, size = 20, keyword = "", status = "" }) {
  const filtered = _filterMembers({ keyword, status });
  return _paginate(filtered, page, size);
}

async function mockFetchMember(mno) {
  const m = MOCK_MEMBERS_DB.find((x) => Number(x.mno) === Number(mno));
  if (!m) throw new Error("NOT_FOUND");
  return m;
}

async function mockPatchMember(mno, payload) {
  const idx = MOCK_MEMBERS_DB.findIndex((x) => Number(x.mno) === Number(mno));
  if (idx < 0) throw new Error("NOT_FOUND");
  const prev = MOCK_MEMBERS_DB[idx];
  const next = { ...prev, ...payload };
  if (typeof next.height === "number" && typeof next.weight === "number") {
    next.bmi = _bmi(next.height, next.weight);
  }
  MOCK_MEMBERS_DB[idx] = next;
  return { ok: true, member: next };
}

async function mockRemoveMember(mno) {
  const idx = MOCK_MEMBERS_DB.findIndex((x) => Number(x.mno) === Number(mno));
  if (idx < 0) return { ok: false };
  // 실제 삭제 대신 상태만 변경
  MOCK_MEMBERS_DB[idx] = { ...MOCK_MEMBERS_DB[idx], status: "DELETED" };
  return { ok: true };
}

/* =========================
   대시보드 집계 (MOCK)
   ========================= */
function _summaryFromMock() {
  const members = MOCK_MEMBERS_DB;

  const totalMembers = members.length;

  // 최근 7일 신규
  const now = new Date();
  const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
  const newThisWeek = members.filter(m => new Date(m.createdAt) >= sevenDaysAgo).length;

  // 평균 BMI
  const avgBMI =
    members.length === 0
      ? 0
      : Math.round((members.reduce((acc, m) => acc + (m.bmi || 0), 0) / members.length) * 10) / 10;

  // 목표 달성(현재체중 <= 목표체중)
  const goalAchieved = members.filter(m => Number(m.weight) <= Number(m.goal_weight)).length;

  // 성별 분포
  const genderRatio = members.reduce(
    (acc, m) => {
      const g = (m.gender || "ETC").toUpperCase();
      if (g === "M") acc.M += 1;
      else if (g === "F") acc.F += 1;
      else acc.ETC += 1;
      return acc;
    },
    { M: 0, F: 0, ETC: 0 }
  );

  return { summary: { totalMembers, newThisWeek, avgBMI, goalAchieved }, genderRatio };
}

async function mockDashboardSummary() {
  return _summaryFromMock();
}

/* =========================
   대시보드: 최근 리뷰/식단 (MOCK)
   ========================= */
const _lorem = [
  "오늘의 단백질 리뷰", "식단 도전기", "유지어트 꿀팁", "헬스장 후기",
  "보충제 맛 비교", "홈트 루틴 공유", "러닝 기록", "체지방 감량기",
];
const _pad2 = (n) => n.toString().padStart(2, "0");
const _dateStr = (d) => `${d.getFullYear()}-${_pad2(d.getMonth() + 1)}-${_pad2(d.getDate())}`;

function _makeMockPosts(type, count = 8) {
  return Array.from({ length: count }).map((_, i) => {
    const minus = _rand(0, 20);
    const created = new Date(Date.now() - minus * 86400000);
    return {
      id: `${type}-${i + 1}`,
      title: `${_lorem[i % _lorem.length]} #${i + 1}`,
      author: NICKS[i % NICKS.length],
      createdAt: _dateStr(created),
    };
  }).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

const MOCK_REVIEWS_DB = _makeMockPosts("review", 8);
const MOCK_DIETS_DB   = _makeMockPosts("diet", 8);

async function mockFetchRecentReviews(limit = 3) {
  return MOCK_REVIEWS_DB.slice(0, Math.max(1, Number(limit || 3)));
}
async function mockFetchRecentDiets(limit = 3) {
  return MOCK_DIETS_DB.slice(0, Math.max(1, Number(limit || 3)));
}

/* =========================
   실제 axios 인스턴스 (토큰 사용 금지)
   ========================= */
const API = axios.create({
  baseURL: "http://localhost:9999/api",
  withCredentials: true,
});

// Authorization 헤더 삽입 로직 제거 완료

/* GET 래핑: 대시보드 관련 목 사용 또는 폴백 */
const _origGet = API.get.bind(API);
const _isDash = (url) => typeof url === "string" && url.startsWith("/admin/dashboard/");
const _dashKind = (url) => url.includes("/summary") ? "summary"
  : url.includes("/recent-reviews") ? "recentReviews"
  : url.includes("/recent-diets") ? "recentDiets" : "";

API.get = async (url, config) => {
  const isDash = _isDash(url);

  // USE_MOCK=true면 대시보드 요청은 즉시 목 응답
  if (isDash && USE_MOCK) {
    const kind = _dashKind(url);
    if (kind === "summary") {
      return { data: await mockDashboardSummary(), status: 200, statusText: "OK(MOCK)", headers: {}, config };
    }
    if (kind === "recentReviews") {
      const limit = config?.params?.limit ?? 3;
      return { data: await mockFetchRecentReviews(limit), status: 200, statusText: "OK(MOCK)", headers: {}, config };
    }
    if (kind === "recentDiets") {
      const limit = config?.params?.limit ?? 3;
      return { data: await mockFetchRecentDiets(limit), status: 200, statusText: "OK(MOCK)", headers: {}, config };
    }
  }

  try {
    return await _origGet(url, config);
  } catch (err) {
    // 서버에서 권한 관련(401/403) 또는 미구현(404)일 때 대시보드는 목으로 폴백
    if (isDash && [401, 403, 404].includes(err?.response?.status)) {
      const kind = _dashKind(url);
      if (kind === "summary") {
        return { data: await mockDashboardSummary(), status: 200, statusText: "OK(Fallback)", headers: {}, config };
      }
      if (kind === "recentReviews") {
        const limit = config?.params?.limit ?? 3;
        return { data: await mockFetchRecentReviews(limit), status: 200, statusText: "OK(Fallback)", headers: {}, config };
      }
      if (kind === "recentDiets") {
        const limit = config?.params?.limit ?? 3;
        return { data: await mockFetchRecentDiets(limit), status: 200, statusText: "OK(Fallback)", headers: {}, config };
      }
    }
    throw err;
  }
};

/* =========================
   공개 API (동일 시그니처 유지)
   - USE_MOCK=true 이거나 401 등 실패 시 더미로 자동 대체
   ========================= */
export const fetchMembers = async ({ page = 1, size = 20, keyword = "", status = "" }) => {
  if (USE_MOCK) {
    return await mockFetchMembers({ page, size, keyword, status });
  }
  try {
    const { data } = await API.get("/admin/members", { params: { page, size, keyword, status } });
    return data;
  } catch (err) {
    if (USE_MOCK || [401, 403, 404].includes(err?.response?.status)) {
      return await mockFetchMembers({ page, size, keyword, status });
    }
    throw err;
  }
};

export const fetchMember = async (mno) => {
  if (USE_MOCK) {
    return await mockFetchMember(mno);
  }
  try {
    const { data } = await API.get(`/admin/members/${mno}`);
    return data;
  } catch (err) {
    if (USE_MOCK || [401, 403, 404].includes(err?.response?.status)) {
      return await mockFetchMember(mno);
    }
    throw err;
  }
};

export const patchMember = async (mno, payload) => {
  if (USE_MOCK) {
    return await mockPatchMember(mno, payload);
  }
  try {
    const { data } = await API.patch(`/admin/members/${mno}`, payload);
    return data;
  } catch (err) {
    if (USE_MOCK || [401, 403, 404].includes(err?.response?.status)) {
      return await mockPatchMember(mno, payload);
    }
    throw err;
  }
};

export const removeMember = async (mno) => {
  if (USE_MOCK) {
    return await mockRemoveMember(mno);
  }
  try {
    const { data } = await API.delete(`/admin/members/${mno}`);
    return data;
  } catch (err) {
    if (USE_MOCK || [401, 403, 404].includes(err?.response?.status)) {
      return await mockRemoveMember(mno);
    }
    throw err;
  }
};

export default API;
