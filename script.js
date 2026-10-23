/**
 * HỆ THỐNG CHẤM CÔNG BỆNH VIỆN - SCRIPT (JAVASCRIPT)
 * Hỗ trợ quản lý ca trực y bác sĩ, tính giờ, xuất Excel và in bảng công
 */

// ================= KẾT NỐI SUPABASE =================
const SUPABASE_URL = 'https://yxyjgasgxamzfxdmkanc.supabase.co';

const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_rpIQ3myNqwQn1ZojrFFoCA_yT2NiBsS';

if (!window.supabase) {
    throw new Error(
        'Không tải được thư viện Supabase. Hãy kiểm tra index.html: ' +
        'supabase-js phải được tải trước script.js.'
    );
}

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: false,
            storage: window.localStorage,
            storageKey: 'bv_cai_lay_auth'
        }
    }
);

// ================= ĐĂNG NHẬP SUPABASE =================

const loginScreen = document.getElementById('loginScreen');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const btnLogin = document.getElementById('btnLogin');
const loginMessage = document.getElementById('loginMessage');
let currentUserRoleName = 'employee';
let currentUserStaffId = null;
// ================= KIỂM TRA QUYỀN ADMIN =================

function isAdmin() {
    return currentUserRoleName === 'admin';
}
// ================= KIỂM TRA QUYỀN =================

function isAdmin() {
    return currentUserRoleName === 'admin';
}

function isManager() {
    return currentUserRoleName === 'manager';
}

function isAdminOrManager() {
    return (
        isAdmin() ||
        isManager()
    );
}
// ================= ĐỌC QUYỀN TÀI KHOẢN =================

async function loadCurrentUserProfile(session) {

    if (!session || !session.user) {
        return null;
    }

    const { data, error } =
        await supabaseClient
            .from('profiles')
            .select('id, email, full_name, role, staff_id')
            .eq('id', session.user.id)
            .maybeSingle();

    if (error) {

        console.error(
            'Lỗi tải quyền tài khoản:',
            error
        );

        currentUserRoleName = 'employee';

        if (currentUserRole) {
            currentUserRole.textContent =
                'Nhân viên';
        }

        return null;
    }

    if (!data) {

        currentUserRoleName = 'employee';

        if (currentUserRole) {
            currentUserRole.textContent =
                'Nhân viên';
        }

        return null;
    }

    currentUserRoleName =
        data.role || 'employee';
    currentUserStaffId =
        data.staff_id || null;
    if (currentUserEmail) {
        currentUserEmail.textContent =
            data.email ||
            session.user.email ||
            'Người dùng';
    }

    if (currentUserRole) {

        if (data.role === 'admin') {

            currentUserRole.textContent =
                'Quản trị viên';

        } else if (data.role === 'manager') {

            currentUserRole.textContent =
                'Quản lý';

        } else {

            currentUserRole.textContent =
                'Nhân viên';
        }
    }
    // ================= PHÂN QUYỀN GIAO DIỆN =================

if (btnOpenStaffModal) {

    btnOpenStaffModal.style.display =
        data.role === 'admin'
            ? ''
            : 'none';
}
    return data;
}
const currentUserEmail =
    document.getElementById('currentUserEmail');

const currentUserRole =
    document.getElementById('currentUserRole');

const btnLogout =
    document.getElementById('btnLogout');
async function checkAuth() {

    try {

        const {
            data,
            error
        } = await supabaseClient.auth.getSession();

        if (error) {

            console.error(
                'Lỗi kiểm tra phiên đăng nhập:',
                error
            );

            loginScreen.style.display = 'flex';

            return false;
        }

        const session = data?.session;

        if (session) {

            console.log(
                'Đã khôi phục phiên đăng nhập:',
                session.user.email
            );

            loginScreen.style.display = 'none';
            updateCurrentUser(session);
            return true;
        }

        console.log(
            'Chưa có phiên đăng nhập.'
        );

        loginScreen.style.display = 'flex';

        return false;

    } catch (error) {

        console.error(
            'Lỗi checkAuth:',
            error
        );

        loginScreen.style.display = 'flex';

        return false;
    }
}

async function handleLogin() {
    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    if (!email || !password) {
        loginMessage.textContent = 'Vui lòng nhập email và mật khẩu.';
        return;
    }

    btnLogin.disabled = true;
    btnLogin.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> ĐANG ĐĂNG NHẬP...';
    loginMessage.textContent = '';

    const { error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        loginMessage.textContent =
            'Đăng nhập thất bại: ' + error.message;

        btnLogin.disabled = false;
        btnLogin.innerHTML =
            '<i class="fa-solid fa-right-to-bracket"></i> ĐĂNG NHẬP';
        return;
    }
    // Đăng nhập thành công
const {
    data: {
        session
    }
} =
    await supabaseClient.auth.getSession();

if (session) {
    await loadCurrentUserProfile(session);
}
    loginScreen.style.display = 'none';
    btnLogin.disabled = false;
    btnLogin.innerHTML =
        '<i class="fa-solid fa-right-to-bracket"></i> ĐĂNG NHẬP';

    await loadData();
    renderStaffSelect();
    renderAttendanceTable();
    updateDashboardStats();
    setupEventListeners();
}

if (btnLogin) {
    btnLogin.addEventListener('click', handleLogin);
}

if (loginPassword) {
    loginPassword.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    });
}


// ================= DỮ LIỆU BAN ĐẦU =================

const DEFAULT_STAFF = [
    // Khoa Cấp cứu
    {
        id: 'BV101',
        name: 'TS.BS. Trần Văn Hùng',
        department: 'Cấp cứu',
        role: 'Trưởng khoa Cấp cứu'
    },
    {
        id: 'BV102',
        name: 'BS. Nguyễn Thị Mai',
        department: 'Cấp cứu',
        role: 'Bác sĩ trực cấp cứu'
    },
    {
        id: 'BV103',
        name: 'ĐD. Lê Thị Hương',
        department: 'Cấp cứu',
        role: 'Điều dưỡng trưởng'
    },
    {
        id: 'BV104',
        name: 'BS. Đỗ Tuấn Anh',
        department: 'Cấp cứu',
        role: 'Bác sĩ cấp cứu ngoại viện 115'
    },
    {
        id: 'BV105',
        name: 'ĐD. Bùi Hoàng Long',
        department: 'Cấp cứu',
        role: 'Điều dưỡng viên Cấp cứu'
    },

    // Khoa Hồi sức tích cực (ICU)
    {
        id: 'BV106',
        name: 'ThS.BS. Hoàng Minh Tuấn',
        department: 'Hồi sức tích cực',
        role: 'Bác sĩ điều trị ICU'
    },
    {
        id: 'BV107',
        name: 'ĐD. Phạm Quốc Anh',
        department: 'Hồi sức tích cực',
        role: 'Điều dưỡng viên ICU'
    },
    {
        id: 'BV108',
        name: 'BSCKI. Lê Thùy Trang',
        department: 'Hồi sức tích cực',
        role: 'Phó trưởng khoa ICU'
    },
    {
        id: 'BV109',
        name: 'ĐD. Vũ Khánh Huyền',
        department: 'Hồi sức tích cực',
        role: 'Điều dưỡng chăm sóc đặc biệt'
    },

    // Khoa Ngoại chấn thương - Phẫu thuật
    {
        id: 'BV110',
        name: 'BSCKII. Đỗ Quang Vinh',
        department: 'Ngoại chấn thương',
        role: 'Phẫu thuật viên chính'
    },
    {
        id: 'BV111',
        name: 'BS. Trịnh Minh Quân',
        department: 'Ngoại chấn thương',
        role: 'Bác sĩ phẫu thuật nội soi'
    },
    {
        id: 'BV112',
        name: 'ĐD. Trần Thu Thảo',
        department: 'Ngoại chấn thương',
        role: 'Điều dưỡng phòng mổ'
    },
    {
        id: 'BV113',
        name: 'KTV. Phạm Đức Huy',
        department: 'Ngoại chấn thương',
        role: 'Kỹ thuật viên gây mê hồi sức'
    },

    // Khoa Nội tổng hợp
    {
        id: 'BV114',
        name: 'PGS.TS.BS. Nguyễn Đình Bách',
        department: 'Nội tổng hợp',
        role: 'Cố vấn chuyên môn Khoa Nội'
    },
    {
        id: 'BV115',
        name: 'ThS.BS. Vũ Thị Hồng Hạnh',
        department: 'Nội tổng hợp',
        role: 'Bác sĩ Nội tim mạch'
    },
    {
        id: 'BV116',
        name: 'BS. Đinh Công Trình',
        department: 'Nội tổng hợp',
        role: 'Bác sĩ Nội tiêu hóa'
    },
    {
        id: 'BV117',
        name: 'ĐD. Nguyễn Bích Ngọc',
        department: 'Nội tổng hợp',
        role: 'Điều dưỡng viên Khoa Nội'
    },

    // Khoa Sản - Phụ khoa
    {
        id: 'BV118',
        name: 'ThS.BS. Vũ Thu Hà',
        department: 'Sản - Phụ khoa',
        role: 'Trưởng khoa Sản'
    },
    {
        id: 'BV119',
        name: 'BSCKI. Hoàng Ngọc Mai',
        department: 'Sản - Phụ khoa',
        role: 'Bác sĩ Sản phụ khoa'
    },
    {
        id: 'BV120',
        name: 'NHS. Lê Mỹ Linh',
        department: 'Sản - Phụ khoa',
        role: 'Nữ hộ sinh trưởng'
    },
    {
        id: 'BV121',
        name: 'NHS. Phan Kiều Oanh',
        department: 'Sản - Phụ khoa',
        role: 'Nữ hộ sinh phòng sinh'
    },

    // Khoa Nhi
    {
        id: 'BV122',
        name: 'BS. Bùi Văn Nam',
        department: 'Nhi khoa',
        role: 'Bác sĩ Nhi khoa'
    },
    {
        id: 'BV123',
        name: 'BSCKI. Trần Tuyết Nhung',
        department: 'Nhi khoa',
        role: 'Bác sĩ Đơn nguyên Sơ sinh'
    },
    {
        id: 'BV124',
        name: 'ĐD. Đỗ Phương Dung',
        department: 'Nhi khoa',
        role: 'Điều dưỡng viên Khoa Nhi'
    },

    // Khoa Dược
    {
        id: 'BV125',
        name: 'DS. Trịnh Lan Anh',
        department: 'Dược',
        role: 'Dược sĩ trực khoa Dược'
    },
    {
        id: 'BV126',
        name: 'ThS.DS. Phạm Quang Hưng',
        department: 'Dược',
        role: 'Dược sĩ lâm sàng'
    },
    {
        id: 'BV127',
        name: 'Dược tá Nguyễn Văn Khiêm',
        department: 'Dược',
        role: 'Nhân viên cấp phát thuốc'
    },

    // Khoa Xét nghiệm & Chẩn đoán
    {
        id: 'BV128',
        name: 'KTV. Ngô Thành Đạt',
        department: 'Xét nghiệm',
        role: 'Kỹ thuật viên xét nghiệm máu'
    },
    {
        id: 'BV129',
        name: 'CN. Hà Minh Châu',
        department: 'Xét nghiệm',
        role: 'Cử nhân Hóa sinh y học'
    },
    {
        id: 'BV130',
        name: 'BSCKI. Phan Thanh Tùng',
        department: 'Xét nghiệm',
        role: 'Bác sĩ Chẩn đoán hình ảnh (CT/X-quang)'
    },
    {
        id: 'BV131',
        name: 'KTV. Lưu Hải Đăng',
        department: 'Xét nghiệm',
        role: 'Kỹ thuật viên MRI'
    },

    // Phòng Hành chính - Hậu cần
    {
        id: 'BV132',
        name: 'CN. Đặng Phương Thảo',
        department: 'Hành chính',
        role: 'Chuyên viên Quản trị Nhân sự'
    },
    {
        id: 'BV133',
        name: 'KS. Nguyễn Trọng Tấn',
        department: 'Hành chính',
        role: 'Kỹ sư Thiết bị & Vật tư y tế'
    },
    {
        id: 'BV134',
        name: 'CN. Dương Thảo Vy',
        department: 'Hành chính',
        role: 'Kế toán - Thu ngân viện phí'
    },
    {
        id: 'BV135',
        name: 'NV. Trần Văn Cường',
        department: 'Hành chính',
        role: 'Đội trưởng An ninh trật tự'
    }
];

const SHIFTS = {
    SHIFT_1: {
        name: 'Ca Sáng',
        start: '07:00',
        end: '11:30',
        duration: 4.5
    },
    SHIFT_2: {
        name: 'Ca Chiều',
        start: '13:00',
        end: '16:30',
        duration: 3.5
    },
    SHIFT_3: {
        name: 'Ca Đêm',
        start: '18:00',
        end: '07:00',
        duration: 13
    },
    SHIFT_24H: {
        name: 'Trực Cấp cứu 24/24',
        start: '07:00',
        end: '07:00',
        duration: 24
    },
    SHIFT_OUT: {
        name: 'Khám ngoài giờ T7 & CN',
        start: '07:00',
        end: '16:30',
        duration: 8
    }
};

// ================= KHỞI TẠO STATE =================

let staffList = [];
let attendanceLogs = [];
let selectedStaff = null;

// ================= DOM ELEMENTS =================

const liveClockEl = document.getElementById('liveClock');
const liveDateEl = document.getElementById('liveDate');

const empSearchInput = document.getElementById('empSearchInput');
const btnClearSearch = document.getElementById('btnClearSearch');
const staffSelect = document.getElementById('staffSelect');
const shiftSelect = document.getElementById('shiftSelect');
const btnCheckIn = document.getElementById('btnCheckIn');
const btnCheckOut = document.getElementById('btnCheckOut');

const previewNameEl = document.getElementById('previewName');
const previewRoleEl = document.getElementById('previewRole');
const previewStatusBadgeEl = document.getElementById('previewStatusBadge');

const statTotalStaffEl = document.getElementById('statTotalStaff');
const statOnDutyEl = document.getElementById('statOnDuty');
const statLateEl = document.getElementById('statLate');
const statCheckedOutEl = document.getElementById('statCheckedOut');
const logCounterEl = document.getElementById('logCounter');

const filterDateEl = document.getElementById('filterDate');
const filterDeptEl = document.getElementById('filterDept');
const filterStatusEl = document.getElementById('filterStatus');
const tableSearchInput = document.getElementById('tableSearchInput');

const attendanceTableBody = document.getElementById('attendanceTableBody');
const emptyStateEl = document.getElementById('emptyState');

const staffModal = document.getElementById('staffModal');
const btnOpenStaffModal = document.getElementById('btnOpenStaffModal');
const btnCloseStaffModal = document.getElementById('btnCloseStaffModal');
const addStaffForm = document.getElementById('addStaffForm');
const staffListTableBody = document.getElementById('staffListTableBody');
const staffTotalCountEl = document.getElementById('staffTotalCount');

const btnexportToCSV = document.getElementById('btnexportToCSV');
const btnPrintReport = document.getElementById('btnPrintReport');
const toastContainer = document.getElementById('toastContainer');

// ================= TIỆN ÍCH THỜI GIAN =================

function getFormattedCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function getFormattedTime(dateObj = new Date()) {
    return dateObj.toTimeString().split(' ')[0];
}

function updateClock() {
    const now = new Date();

    liveClockEl.textContent = getFormattedTime(now);

    const days = [
        'Chủ Nhật',
        'Thứ Hai',
        'Thứ Ba',
        'Thứ Tư',
        'Thứ Năm',
        'Thứ Sáu',
        'Thứ Bảy'
    ];

    const dayName = days[now.getDay()];

    const dateFormatted =
        `${String(now.getDate()).padStart(2, '0')}/` +
        `${String(now.getMonth() + 1).padStart(2, '0')}/` +
        now.getFullYear();

    liveDateEl.textContent = `${dayName}, ${dateFormatted}`;
}

// ================= DỮ LIỆU NHÂN VIÊN SUPABASE =================

async function loadStaffFromSupabase() {
    const { data, error } = await supabaseClient
        .from('staff')
        .select('id, name, department, role')
        .order('id', { ascending: true });

    if (error) {
        console.error('Lỗi tải danh sách nhân viên:', error);
        showToast(
            'Không thể tải danh sách nhân viên từ Supabase!',
            'danger'
        );
        return false;
    }

    staffList = data || [];

    console.log(
        `Đã tải ${staffList.length} nhân viên từ Supabase.`
    );

    return true;
}
// ================= LOAD / SAVE DATA =================

async function loadData() {
    // Tải danh sách nhân viên từ Supabase
    const staffLoaded = await loadStaffFromSupabase();

    if (!staffLoaded) {
        return false;
    }

    // Tải dữ liệu chấm công từ Supabase
    const logsLoaded = await loadAttendanceLogsFromSupabase();

    if (!logsLoaded) {
        return false;
    }

    console.log(
        `Đã tải ${staffList.length} nhân viên và ${attendanceLogs.length} bản ghi chấm công từ Supabase.`
    );

    return true;
}
// ================= TẢI CHẤM CÔNG TỪ SUPABASE =================

async function loadAttendanceLogsFromSupabase() {
    const { data, error } = await supabaseClient
        .from('attendance_logs')
        .select(`
            id,
            staff_id,
            work_date,
            shift_id,
            check_in_time,
            check_out_time,
            status,
            is_completed,
            total_hours,
            created_at,
            staff:staff_id (
                id,
                name,
                department,
                role
            )
        `)
        .order('created_at', {
            ascending: false
        });

    if (error) {
        console.error(
            'Lỗi tải dữ liệu chấm công từ Supabase:',
            error
        );

        showToast(
            'Không thể tải dữ liệu chấm công từ Supabase!',
            'danger'
        );

        attendanceLogs = [];

        return false;
    }

    attendanceLogs = (data || []).map(log => {

        const staff = log.staff;

        const shift =
            SHIFTS[log.shift_id];

        return {
            id: log.id,

            staffId:
                log.staff_id,
            workDate:
                log.work_date,
            staffName:
                staff
                    ? staff.name
                    : 'Không xác định',

            department:
                staff
                    ? staff.department
                    : '',

            role:
                staff
                    ? staff.role
                    : '',

            shift:
                shift
                    ? shift.name
                    : log.shift_id,

            shiftKey:
                log.shift_id,

            checkIn:
                log.check_in_time,

            checkOut:
                log.check_out_time,

            status:
                log.status,

            isCompleted:
                log.is_completed,

                workHours:
            Number.isFinite(
            Number(log.total_hours)
    )
            ? Number(log.total_hours)
            : 0,

            note:
                ''
        };
    });

    console.log(
        `Đã tải ${attendanceLogs.length} bản ghi chấm công từ Supabase.`
    );

    return true;
}

/* ===== SUPABASE REALTIME: NHẬT KÝ CHẤM CÔNG ===== */

let attendanceRealtimeChannel = null;

function setupAttendanceRealtime() {
    // Tránh đăng ký nhiều subscription
    if (attendanceRealtimeChannel) return;

    attendanceRealtimeChannel = supabaseClient
        .channel('attendance-logs-live')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'attendance_logs'
            },
            async (payload) => {
                console.log(
                    'Attendance log thay đổi:',
                    payload.eventType
                );

                const loaded =
                    await loadAttendanceLogsFromSupabase();

                if (!loaded) return;

                renderAttendanceTable();
                updateDashboardStats();
                updateStaffPreview();
                updateCheckButtons();
            }
        )
        .subscribe((status) => {
            console.log(
                'Realtime attendance:',
                status
            );
        });
}

// ================= LƯU NHÂN VIÊN SUPABASE =================

async function saveStaffData() {
    if (!Array.isArray(staffList)) {
        return false;
    }

    const { error } = await supabaseClient
        .from('staff')
        .upsert(
            staffList,
            {
                onConflict: 'id'
            }
        );

    if (error) {
        console.error(
            'Lỗi lưu nhân viên lên Supabase:',
            error
        );

        showToast(
            'Không thể lưu dữ liệu nhân viên!',
            'danger'
        );

        return false;
    }

    return true;
}


// ================= LƯU CHẤM CÔNG LOCAL =================

function saveLogsData() {
    localStorage.setItem(
        'hospital_attendance_logs',
        JSON.stringify(attendanceLogs)
    );
}


// ================= TẠO DỮ LIỆU CHẤM CÔNG MẪU =================

function createSampleLogs(forceCreate = false) {
    if (!forceCreate && attendanceLogs.length >= 5) {
        return;
    }

    const today = getFormattedCurrentDate();

    const sampleStaff = staffList.slice(0, 8);

    if (sampleStaff.length === 0) {
        return;
    }

    const sampleTimes = [
        '06:55:00',
        '07:02:00',
        '06:48:00',
        '07:10:00',
        '12:55:00',
        '13:03:00',
        '17:55:00',
        '18:05:00'
    ];

    sampleStaff.forEach((staff, index) => {
        const shift =
            index < 4
                ? SHIFTS.SHIFT_1.name
                : SHIFTS.SHIFT_2.name;

        const checkInTime =
            `${today}T${sampleTimes[index]}`;

        attendanceLogs.push({
            id:
                'LOG-' +
                Date.now() +
                '-' +
                index,

            staffId: staff.id,
            staffName: staff.name,
            department: staff.department,
            role: staff.role,

            shift: shift,

            checkIn: checkInTime,
            checkOut: null,

            status:
                index === 3
                    ? 'late'
                    : 'present',

            note:
                index === 3
                    ? 'Đi trễ'
                    : '',

            workHours: 0
        });
    });

    saveLogsData();
}


// ================= TOAST =================

function showToast(message, type = 'success') {
    if (!toastContainer) {
        console.log(message);
        return;
    }

    const toast = document.createElement('div');

    toast.className =
        `toast-message toast-${type}`;

    let icon = 'fa-circle-check';

    if (type === 'danger' || type === 'error') {
        icon = 'fa-circle-exclamation';
    }

    if (type === 'warning') {
        icon = 'fa-triangle-exclamation';
    }

    toast.innerHTML = `
        <i class="fa-solid ${icon}"></i>
        <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hide');

        setTimeout(() => {
            toast.remove();
        }, 300);

    }, 3000);
}


// ================= TÌM NHÂN VIÊN =================

function findStaffById(id) {
    return staffList.find(
        staff => staff.id === id
    );
}

function getActiveAttendance(staffId) {

    return attendanceLogs.find(log => {

        if (log.staffId !== staffId) {
            return false;
        }

        // Có giờ vào nhưng chưa có giờ ra
        if (!log.checkIn) {
            return false;
        }

        if (log.checkOut) {
            return false;
        }

        return true;
    });
}

// ================= RENDER DANH SÁCH NHÂN VIÊN =================

function renderStaffSelect(searchText = '') {
    if (!staffSelect) {
        return;
    }

    const keyword =
        searchText.trim().toLowerCase();

    const filteredStaff = staffList.filter(staff => {

    // Nhân viên chỉ được chọn chính mình
    if (!isAdminOrManager()) {
        return staff.id === currentUserStaffId;
    }

    // Admin và Manager được chọn tất cả nhân viên
    if (!keyword) {
        return true;
    }

    return (
        staff.id.toLowerCase().includes(keyword) ||
        staff.name.toLowerCase().includes(keyword) ||
        staff.department.toLowerCase().includes(keyword) ||
        staff.role.toLowerCase().includes(keyword)
    );
});

    staffSelect.innerHTML =
        '<option value="">-- Chọn nhân viên --</option>';

    filteredStaff.forEach(staff => {
        const option = document.createElement('option');

        option.value = staff.id;

        option.textContent =
            `${staff.id} - ${staff.name} - ${staff.department}`;

        staffSelect.appendChild(option);
    });

    // Nếu nhân viên đang được chọn vẫn còn trong danh sách
    if (
        selectedStaff &&
        filteredStaff.some(
            staff => staff.id === selectedStaff.id
        )
    ) {
        staffSelect.value = selectedStaff.id;
    }
}


// ================= RENDER CA LÀM =================

function renderShiftSelect() {
    if (!shiftSelect) {
        return;
    }

    shiftSelect.innerHTML =
        '<option value="">-- Chọn ca trực --</option>';

    Object.keys(SHIFTS).forEach(key => {
        const shift = SHIFTS[key];

        const option = document.createElement('option');

        option.value = key;

        option.textContent =
            `${shift.name} (${shift.start} - ${shift.end})`;

        shiftSelect.appendChild(option);
    });
}


// ================= CẬP NHẬT THÔNG TIN NHÂN VIÊN =================

function updateStaffPreview() {
    if (!previewNameEl) {
        return;
    }

    if (!selectedStaff) {
        previewNameEl.textContent =
            'Chưa chọn nhân viên';

        previewRoleEl.textContent =
            'Vui lòng chọn nhân viên để chấm công';

        if (previewStatusBadgeEl) {
            previewStatusBadgeEl.textContent =
                'CHƯA CHỌN';

            previewStatusBadgeEl.className =
                'status-badge';
        }

        return;
    }

    previewNameEl.textContent =
        selectedStaff.name;

    previewRoleEl.textContent =
        `${selectedStaff.id} • ${selectedStaff.department} • ${selectedStaff.role}`;

    const activeLog =
        getActiveAttendance(selectedStaff.id);

    if (previewStatusBadgeEl) {
        if (activeLog) {
            previewStatusBadgeEl.textContent =
                'ĐANG TRỰC';

            previewStatusBadgeEl.className =
                'status-badge status-present';

        } else {
            previewStatusBadgeEl.textContent =
                'CHƯA CHẤM';

            previewStatusBadgeEl.className =
                'status-badge status-off';
        }
    }
}


// ================= XỬ LÝ CHỌN NHÂN VIÊN =================

function handleStaffChange() {
    const staffId = staffSelect.value;

    if (!staffId) {
        selectedStaff = null;
        updateStaffPreview();
        updateCheckButtons();
        return;
    }

    selectedStaff =
        findStaffById(staffId) || null;

    updateStaffPreview();
    updateCheckButtons();
}


// ================= KIỂM TRA NÚT CHẤM CÔNG =================

function updateCheckButtons() {
    if (!btnCheckIn || !btnCheckOut) {
        return;
    }

    if (!selectedStaff) {
        btnCheckIn.disabled = true;
        btnCheckOut.disabled = true;
        return;
    }

    const activeLog =
        getActiveAttendance(selectedStaff.id);

    if (activeLog) {
        btnCheckIn.disabled = true;
        btnCheckOut.disabled = false;
    } else {
        btnCheckIn.disabled = false;
        btnCheckOut.disabled = true;
    }
}

// ================= TÍNH TRẠNG THÁI CHẤM CÔNG =================

function calculateAttendanceStatus(
    checkInTime,
    shiftKey
) {

    const shift = SHIFTS[shiftKey];

    if (!shift) {
        return 'present';
    }


    // =========================
    // TÁCH GIỜ VÀO
    // =========================

    const [
        checkHour,
        checkMinute,
        checkSecond = 0
    ] =
        String(checkInTime)
            .split(':')
            .map(Number);


    // Nếu giờ không hợp lệ
    if (
        Number.isNaN(checkHour) ||
        Number.isNaN(checkMinute)
    ) {
        return 'present';
    }


    // =========================
    // TÁCH GIỜ BẮT ĐẦU CA
    // =========================

    const [
        startHour,
        startMinute
    ] =
        String(shift.start)
            .split(':')
            .map(Number);


    let checkMinutes =
        checkHour * 60 +
        checkMinute +
        checkSecond / 60;


    const startMinutes =
        startHour * 60 +
        startMinute;


    // =========================
    // CA ĐÊM
    // 18:00 → 07:00 hôm sau
    // =========================

    if (
        shiftKey === 'SHIFT_3' ||
        shiftKey === 'SHIFT_24H'
    ) {

        // Nếu chấm từ 00:00 đến trước 12:00
        // thì tính là phần tiếp theo của ca hôm trước
        if (checkMinutes < 12 * 60) {
            checkMinutes += 24 * 60;
        }
    }


    // =========================
    // CHO PHÉP TRỄ 15 PHÚT
    // =========================

    const allowedLateMinutes =
        startMinutes + 15;


    if (checkMinutes > allowedLateMinutes) {
        return 'late';
    }


    return 'present';
}
// ================= TÍNH GIỜ LÀM =================

function calculateWorkHours(checkIn, checkOut) {

    if (!checkIn || !checkOut) {
        return 0;
    }

    function parseTime(timeString) {

        if (!timeString) {
            return null;
        }

        const parts = String(timeString)
            .split(':')
            .map(Number);

        if (parts.length < 2) {
            return null;
        }

        const hours = parts[0];
        const minutes = parts[1];
        const seconds = parts[2] || 0;

        if (
            !Number.isFinite(hours) ||
            !Number.isFinite(minutes) ||
            !Number.isFinite(seconds)
        ) {
            return null;
        }

        const date = new Date();

        date.setHours(
            hours,
            minutes,
            seconds,
            0
        );

        return date;
    }

    const start = parseTime(checkIn);
    const end = parseTime(checkOut);

    if (!start || !end) {
        return 0;
    }

    let milliseconds =
        end.getTime() -
        start.getTime();

    // Ca qua đêm:
    // Ví dụ 20:00 -> 07:00 hôm sau
    if (milliseconds < 0) {
        milliseconds +=
            24 * 60 * 60 * 1000;
    }

    const hours =
        milliseconds /
        (1000 * 60 * 60);

    if (!Number.isFinite(hours)) {
        return 0;
    }

    return Math.round(hours * 100) / 100;
}
// ================= CHẤM CÔNG VÀO =================

async function handleCheckIn() {
    if (!selectedStaff) {
        showToast(
            'Vui lòng chọn nhân viên!',
            'warning'
        );
        return;
    }
    // Nhân viên chỉ được chấm công cho chính mình
if (
    !isAdminOrManager() &&
    selectedStaff.id !== currentUserStaffId
) {
    showToast(
        'Bạn chỉ được chấm công cho chính mình!',
        'danger'
    );
    return;
}
    const shiftKey =
        shiftSelect.value;

    if (!shiftKey || !SHIFTS[shiftKey]) {
        showToast(
            'Vui lòng chọn ca trực!',
            'warning'
        );
        return;
    }

    const activeLog =
        getActiveAttendance(
            selectedStaff.id
        );

    if (activeLog) {
        showToast(
            'Nhân viên này đang có ca trực chưa kết thúc!',
            'warning'
        );
        return;
    }

    const now =
        new Date();

    const workDate =
        getFormattedCurrentDate();

   	const checkIn =
    	getFormattedTime(now);

        // ================= KIỂM TRA KHUNG GIỜ CA =================

const shift =
    SHIFTS[shiftKey];

const nowMinutes =
    now.getHours() * 60
    +
    now.getMinutes();

const [
    startHour,
    startMinute
] =
    shift.start
        .split(':')
        .map(Number);

const [
    endHour,
    endMinute
] =
    shift.end
        .split(':')
        .map(Number);

const startMinutes =
    startHour * 60
    +
    startMinute;

let endMinutes =
    endHour * 60
    +
    endMinute;


// Ca qua đêm
if (
    shiftKey === 'SHIFT_3'
    ||
    shiftKey === 'SHIFT_24H'
) {

    endMinutes += 24 * 60;

}


// Thời gian được phép chấm sớm 15 phút
let currentMinutes =
    nowMinutes;

if (
    (
        shiftKey === 'SHIFT_3'
        ||
        shiftKey === 'SHIFT_24H'
    )
    &&
    currentMinutes < startMinutes
) {
    currentMinutes += 24 * 60;
}


const allowedStart =
    startMinutes - 15;


// Không cho chấm trước giờ cho phép
if (
    currentMinutes < allowedStart
    ||
    currentMinutes > endMinutes
) {

    showToast(
        `Chưa đến thời gian chấm ${shift.name}. ` +
        `Khung giờ: ${shift.start} - ${shift.end}` +
        (
            shiftKey === 'SHIFT_3'
            ||
            shiftKey === 'SHIFT_24H'
                ? ' hôm sau'
                : ''
        ),
        'warning'
    );

    return;
}

    const status =
        calculateAttendanceStatus(
            checkIn,
            shiftKey
        );

    const newLog = {
        id:
            'LOG-' +
            Date.now(),

        staff_id:
            selectedStaff.id,

        work_date:
            workDate,

        shift_id:
            shiftKey,

        check_in_time:
            checkIn,

        check_out_time:
            null,

        status:
            status,

        is_completed:
            false,

        total_hours:
            '0'
    };

    const {
        data,
        error
    } = await supabaseClient
        .from('attendance_logs')
        .insert([newLog])
        .select()
        .single();

    if (error) {
        console.error(
            'Lỗi ghi chấm công vào Supabase:',
            error
        );

        showToast(
            'Không thể lưu chấm công vào Supabase: ' +
            error.message,
            'danger'
        );

        return;
    }

    attendanceLogs.unshift({
        id:
            data.id,

        staffId:
            selectedStaff.id,

        staffName:
            selectedStaff.name,

        department:
            selectedStaff.department,

        role:
            selectedStaff.role,

        shift:
            shift.name,

        shiftKey:
            shiftKey,

        checkIn:
            data.check_in_time,

        checkOut:
            null,

        status:
            data.status,

        isCompleted:
            false,

        workHours:
            0,

        note:
            status === 'late'
                ? 'Đi trễ'
                : ''
    });

    await loadAttendanceLogsFromSupabase();
    renderAttendanceTable();
    updateDashboardStats();
    updateStaffPreview();
    updateCheckButtons();

    showToast(
        `Đã chấm công vào cho ${selectedStaff.name}`,
        'success'
    );
}
// ================= CHẤM CÔNG RA =================

async function handleCheckOut() {
    if (!selectedStaff) {
        showToast(
            'Vui lòng chọn nhân viên!',
            'warning'
        );
        return;
    }
    // Nhân viên chỉ được chấm công ra cho chính mình
if (
    !isAdminOrManager() &&
    selectedStaff.id !== currentUserStaffId
) {
    showToast(
        'Bạn chỉ được kết thúc ca của chính mình!',
        'danger'
    );
    return;
}
    const activeLog =
        getActiveAttendance(
            selectedStaff.id
        );

    if (!activeLog) {
        showToast(
            'Nhân viên này chưa có ca trực đang hoạt động!',
            'warning'
        );
        return;
    }

    const now =
        new Date();

   	const checkOut =
    	getFormattedTime(now);
    const workHours =
        calculateWorkHours(
            activeLog.checkIn,
            checkOut
        );

    const {
        data,
        error
    } = await supabaseClient
        .from('attendance_logs')
        .update({
            check_out_time:
                checkOut,

            status:
                'completed',

            is_completed:
                true,

            total_hours:
                workHours.toString()
        })
        .eq(
            'id',
            activeLog.id
        )
        .select()
        .single();

    if (error) {
        console.error(
            'Lỗi cập nhật chấm công ra:',
            error
        );

        showToast(
            'Không thể lưu giờ ra lên Supabase: ' +
            error.message,
            'danger'
        );

        return;
    }

    const localLog =
        attendanceLogs.find(
            log =>
                log.id === activeLog.id
        );

    if (localLog) {
        localLog.checkOut =
            data.check_out_time;

        localLog.status =
            data.status;

        localLog.isCompleted =
            data.is_completed;

        localLog.workHours =
            Number(data.total_hours);
    }

    await loadAttendanceLogsFromSupabase();
    renderAttendanceTable();
    updateDashboardStats();
    updateStaffPreview();
    updateCheckButtons();

    showToast(
        `Đã chấm công ra cho ${selectedStaff.name}`,
        'success'
    );
}

// ================= FORMAT NGÀY GIỜ =================

function formatDateTime(value) {
    if (!value) {
        return '--';
    }

    const text = String(value).trim();

    // Supabase trả kiểu TIME: 09:40:53
    if (/^\d{2}:\d{2}(:\d{2})?$/.test(text)) {
        const parts = text.split(':');

        const hour = String(parts[0]).padStart(2, '0');
        const minute = String(parts[1]).padStart(2, '0');
        const second = String(parts[2] || '00').padStart(2, '0');

        return `${hour}:${minute}:${second}`;
    }

    // Trường hợp là ngày giờ đầy đủ
    const date = new Date(text);

    if (Number.isNaN(date.getTime())) {
        return text;
    }

    const day =
        String(date.getDate()).padStart(2, '0');

    const month =
        String(date.getMonth() + 1).padStart(2, '0');

    const year =
        date.getFullYear();

    const hours =
        String(date.getHours()).padStart(2, '0');

    const minutes =
        String(date.getMinutes()).padStart(2, '0');

    const seconds =
        String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

// ================= LẤY TÊN TRẠNG THÁI =================

function getStatusText(status) {
    switch (status) {
        case 'present':
            return 'Đúng giờ';

        case 'late':
            return 'Đi trễ';

        case 'completed':
            return 'Đã hoàn thành';

        case 'absent':
            return 'Vắng';

        default:
            return status || '--';
    }
}


// ================= CLASS TRẠNG THÁI =================

function getStatusClass(status) {
    switch (status) {
        case 'present':
            return 'status-present';

        case 'late':
            return 'status-late';

        case 'completed':
            return 'status-completed';

        case 'absent':
            return 'status-absent';

        default:
            return '';
    }
}
// ================= RENDER BẢNG CHẤM CÔNG & LỌC =================

function renderAttendanceTable() {

    const filterDate =
        filterDateEl
            ? filterDateEl.value
            : '';

    const filterDept =
        filterDeptEl
            ? filterDeptEl.value
            : 'ALL';

    const filterStatus =
        filterStatusEl
            ? filterStatusEl.value
            : 'ALL';

    const searchTerm =
        tableSearchInput
            ? tableSearchInput.value
                .trim()
                .toLowerCase()
            : '';

    const filtered =
        attendanceLogs.filter(log => {

            // ================= LỌC NGÀY =================

            if (
                filterDate &&
                log.workDate !== filterDate
            ) {
                return false;
            }


            // ================= LỌC KHOA =================

            if (
                filterDept &&
                filterDept !== 'ALL' &&
                log.department !== filterDept
            ) {
                return false;
            }


            // ================= LỌC TRẠNG THÁI =================

            if (filterStatus === 'ON_DUTY') {

                if (log.isCompleted) {
                    return false;
                }

            } else if (
                filterStatus === 'COMPLETED'
            ) {

                if (!log.isCompleted) {
                    return false;
                }

            } else if (
                filterStatus === 'LATE'
            ) {

                if (
                    String(log.status)
                        .toLowerCase() !== 'late'
                ) {
                    return false;
                }

            } else if (
    filterStatus === 'ON_TIME'
) {

    if (
        String(log.status || '').toLowerCase() !== 'present'
    ) {
        return false;
    }
}


            // ================= TÌM KIẾM =================

            if (searchTerm) {

                const content =
                    [
                        log.staffId,
                        log.staffName,
                        log.department,
                        log.role,
                        log.shift
                    ]
                        .filter(Boolean)
                        .join(' ')
                        .toLowerCase();

                if (
                    !content.includes(
                        searchTerm
                    )
                ) {
                    return false;
                }
            }

            return true;
        });


    // ================= SỐ BẢN GHI =================

    if (logCounterEl) {
        logCounterEl.textContent =
            `${filtered.length} bản ghi`;
    }


    // ================= KHÔNG CÓ DỮ LIỆU =================

    if (
        filtered.length === 0
    ) {

        if (attendanceTableBody) {
            attendanceTableBody.innerHTML = '';
        }

        if (emptyStateEl) {
            emptyStateEl.style.display =
                'block';
        }

        return;
    }


    if (emptyStateEl) {
        emptyStateEl.style.display =
            'none';
    }


    // ================= HIỂN THỊ DỮ LIỆU =================

    if (!attendanceTableBody) {
        return;
    }

    attendanceTableBody.innerHTML =
        filtered.map(
            (log, index) => {

                let statusBadge = '';

                const normalizedStatus =
                    String(
                        log.status || ''
                    ).toLowerCase();
                if (
                    !log.isCompleted
                ) {

                    statusBadge = `
                        <span class="status-pill on-duty">
                            <i class="fa-solid fa-stethoscope"></i>
                            Đang trực
                        </span>
                    `;

                } else if (
                    normalizedStatus === 'late'
                ) {

                    statusBadge = `
                        <span class="status-pill late">
                            <i class="fa-solid fa-clock-rotate-left"></i>
                            Vào muộn
                        </span>
                    `;

                } else {

                    statusBadge = `
                        <span class="status-pill on-time">
                            <i class="fa-solid fa-check"></i>
                            Đúng giờ
                        </span>
                    `;
                }


                return `
                    <tr>

                        <td>
                            ${index + 1}
                        </td>

                        <td>
                            <strong>
                                ${log.staffId || '--'}
                            </strong>
                        </td>

                        <td>
                            <div style="
                                font-weight:700;
                                color:var(--text-primary);
                            ">
                                ${log.staffName || '--'}
                            </div>

                            <small style="
                                color:var(--text-muted);
                            ">
                                ${log.role || 'Cán bộ Y tế'}
                            </small>
                        </td>

                        <td>
                            <span class="badge-dept">
                                ${log.department || '--'}
                            </span>
                        </td>

                        <td>
                            ${log.shift || log.shiftKey || '--'}
                        </td>

                        <td style="
                            color:#0f766e;
                            font-weight:700;
                        ">
                            ${
                                formatDateTime(
                                    log.checkIn
                                )
                            }
                        </td>

                        <td>
                            ${
                                log.checkOut
                                    ? `
                                        <span style="
                                            color:#ea580c;
                                            font-weight:700;
                                        ">
                                            ${formatDateTime(
                                                log.checkOut
                                            )}
                                        </span>
                                      `
                                    : `
                                        <span style="
                                            color:var(--text-muted);
                                            font-style:italic;
                                        ">
                                            Chưa ra ca
                                        </span>
                                      `
                            }
                        </td>

                        <td>
                            <strong>
                                ${
                                    Number.isFinite(
                                    Number(log.workHours)
                                )
                                    ? Number(
                                    log.workHours
                                ).toFixed(2)
                                    : '--'
                                }
                            </strong>
                        </td>

                        <td>
                            ${statusBadge}
                        </td>

                        <td class="text-center">

                            ${isAdmin() ? `
                    <button
                        class="action-btn-del"
                        data-log-id="${log.id}"
                        title="Xóa bản ghi"
                    >
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                        ` : ''}

                        </td>

                    </tr>
                `;
            }
        ).join('');
}
// ================= THỐNG KÊ DASHBOARD =================

function updateDashboardStats() {

    const today =
        getFormattedCurrentDate();


    // Lấy các bản ghi chấm công của hôm nay
    const todayLogs =
        attendanceLogs.filter(
            log =>
                log.workDate === today
        );


    // ================= TỔNG NHÂN SỰ =================

    if (statTotalStaffEl) {

        statTotalStaffEl.textContent =
            staffList.length;
    }


    // ================= ĐANG TRỰC =================

    const onDutyCount =
        todayLogs.filter(
            log =>
                log.isCompleted !== true &&
                !!log.checkIn &&
                !log.checkOut
        ).length;


    if (statOnDutyEl) {

        statOnDutyEl.textContent =
            onDutyCount;
    }


    // ================= ĐI MUỘN =================

    const lateCount =
        todayLogs.filter(
            log =>
                String(
                    log.status || ''
                ).toLowerCase() === 'late'
        ).length;


    if (statLateEl) {

        statLateEl.textContent =
            lateCount;
    }


    // ================= ĐÃ KẾT THÚC CA =================

    const completedCount =
    todayLogs.filter(log => {
        return !!(
            log.checkOut ||
            log.check_out_time
        );
    }).length;


    if (statCheckedOutEl) {

        statCheckedOutEl.textContent =
            completedCount;
    }
        renderDepartmentStats();
        renderCharts();
}
// ================= TẠO DANH SÁCH KHOA =================

function renderDepartmentFilter() {
    if (!filterDeptEl) {
        return;
    }

    const currentValue =
        filterDeptEl.value;

    const departments =
        [...new Set(
            staffList
                .map(
                    staff =>
                        staff.department
                )
                .filter(Boolean)
        )]
        .sort();

    filterDeptEl.innerHTML =
        '<option value="">Tất cả khoa/phòng</option>';

    departments.forEach(department => {
        const option =
            document.createElement('option');

        option.value =
            department;

        option.textContent =
            department;

        filterDeptEl.appendChild(
            option
        );
    });

    if (
        departments.includes(
            currentValue
        )
    ) {
        filterDeptEl.value =
            currentValue;
    }
}
// ================= THỐNG KÊ THEO KHOA / PHÒNG =================

function renderDepartmentStats() {

    const statsBody =
        document.getElementById(
            'departmentStatsBody'
        );

    if (!statsBody) {
        return;
    }


    const today =
        getFormattedCurrentDate();


    // Danh sách khoa/phòng từ danh sách nhân sự
    const departments =
        [
            ...new Set(
                staffList
                    .map(
                        staff =>
                            staff.department
                    )
                    .filter(Boolean)
            )
        ].sort();


    if (departments.length === 0) {

        statsBody.innerHTML = `
            <tr>
                <td colspan="8"
                    style="text-align:center;">
                    Chưa có dữ liệu nhân sự
                </td>
            </tr>
        `;

        return;
    }


    statsBody.innerHTML =
        departments.map(
            (department, index) => {

                // Nhân sự thuộc khoa
                const departmentStaff =
                    staffList.filter(
                        staff =>
                            staff.department ===
                            department
                    );


                const staffIds =
                    departmentStaff.map(
                        staff =>
                            staff.id
                    );


                // Bản ghi chấm công hôm nay
                const departmentLogs =
                    attendanceLogs.filter(
                        log =>
                            log.workDate === today &&
                            staffIds.includes(
                                log.staffId
                            )
                    );


                // Đã chấm công
                const checkedInCount =
                    departmentLogs.filter(
                        log =>
                            !!log.checkIn
                    ).length;


                // Đang trực
                const onDutyCount =
                    departmentLogs.filter(
                        log =>
                            !!log.checkIn &&
                            !log.checkOut &&
                            log.isCompleted !== true
                    ).length;


                // Đi muộn
                const lateCount =
                    departmentLogs.filter(
                        log =>
                            String(
                                log.status || ''
                            ).toLowerCase() ===
                            'late'
                    ).length;


                // Đã kết thúc ca
                const completedCount =
                    departmentLogs.filter(
                        log =>
                            log.isCompleted === true ||
                            !!log.checkOut
                    ).length;


                // Tổng giờ làm
                const totalHours =
                    departmentLogs.reduce(
                        (total, log) => {

                            const hours =
                                Number(
                                    log.workHours
                                );

                            if (
                                Number.isFinite(
                                    hours
                                )
                            ) {
                                return total + hours;
                            }

                            return total;
                        },
                        0
                    );


                return `
                    <tr>

                        <td>
                            ${index + 1}
                        </td>

                        <td>
                            <strong>
                                ${department}
                            </strong>
                        </td>

                        <td>
                            <strong>
                                ${departmentStaff.length}
                            </strong>
                        </td>

                        <td>
                            ${checkedInCount}
                        </td>

                        <td>
                            <strong>
                                ${onDutyCount}
                            </strong>
                        </td>

                        <td>
                            ${lateCount}
                        </td>

                        <td>
                            ${completedCount}
                        </td>

                        <td>
                            <strong>
                                ${totalHours.toFixed(2)}
                            </strong>
                        </td>

                    </tr>
                `;
            }
        ).join('');
}
// ================= QUẢN LÝ NHÂN VIÊN =================

function renderStaffManagement() {
    if (!staffListTableBody) {
        return;
    }

    staffListTableBody.innerHTML = '';

    const sortedStaff =
        [...staffList].sort(
            (a, b) =>
                a.id.localeCompare(b.id)
        );

    sortedStaff.forEach(
        (staff, index) => {
            const tr =
                document.createElement('tr');

            tr.innerHTML = `
                <td>
                    ${index + 1}
                </td>

                <td>
                    <strong>
                        ${staff.id}
                    </strong>
                </td>

                <td>
                    ${staff.name}
                </td>

                <td>
                    ${staff.department}
                </td>

                <td>
                    ${staff.role}
                </td>

                <td>
                    <button
                        type="button"
                        class="btn-table-delete btn-delete-staff"
                        data-staff-id="${staff.id}"
                        title="Xóa nhân viên"
                    >
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            `;

            staffListTableBody.appendChild(tr);
        }
    );

    if (staffTotalCountEl) {
        staffTotalCountEl.textContent =
            staffList.length;
    }
}


// ================= THÊM NHÂN VIÊN =================

async function addStaff() {
    if (!isAdmin()) {
    showToast(
        'Bạn không có quyền thêm nhân viên!',
        'danger'
    );
    return;
}
    if (!addStaffForm) {
        return;
    }

    // Lấy dữ liệu trực tiếp theo ID của form HTML
    const idEl =
        document.getElementById('newStaffId');

    const nameEl =
        document.getElementById('newStaffName');

    const departmentEl =
        document.getElementById('newStaffDept');

    const roleEl =
        document.getElementById('newStaffRole');


    const id =
        idEl
            ? idEl.value.trim().toUpperCase()
            : '';

    const name =
        nameEl
            ? nameEl.value.trim()
            : '';

    const department =
        departmentEl
            ? departmentEl.value.trim()
            : '';

    const role =
        roleEl
            ? roleEl.value.trim()
            : '';


    // Kiểm tra dữ liệu
    if (
        !id ||
        !name ||
        !department ||
        !role
    ) {

        showToast(
            'Vui lòng nhập đầy đủ thông tin nhân viên!',
            'warning'
        );

        return;
    }


    // Kiểm tra mã nhân viên đã tồn tại
    const existed =
        staffList.some(
            staff =>
                String(staff.id).toLowerCase() ===
                id.toLowerCase()
        );


    if (existed) {

        showToast(
            'Mã nhân viên đã tồn tại!',
            'warning'
        );

        return;
    }


    // Tạo nhân viên mới
    const newStaff = {
        id: id,
        name: name,
        department: department,
        role: role
    };


    // Lưu vào Supabase
    const { data, error } =
        await supabaseClient
            .from('staff')
            .insert([newStaff])
            .select()
            .single();


    if (error) {

        console.error(
            'Lỗi thêm nhân viên:',
            error
        );

        showToast(
            'Không thể thêm nhân viên: ' +
            error.message,
            'danger'
        );

        return;
    }


    // Lấy dữ liệu thực tế từ Supabase
    const savedStaff =
        data || newStaff;


    // Cập nhật danh sách trên giao diện
    staffList.push(
        savedStaff
    );


    staffList.sort(
        (a, b) =>
            String(a.id).localeCompare(
                String(b.id)
            )
    );


    renderStaffSelect();

    renderDepartmentFilter();

    renderStaffManagement();

    updateDashboardStats();


    // Xóa nội dung form
    addStaffForm.reset();


    showToast(
        `Đã thêm nhân viên ${savedStaff.id} - ${savedStaff.name} thành công!`,
        'success'
    );
}


// ================= XÓA NHÂN VIÊN =================

async function removeStaff(staffId) {
    if (!isAdmin()) {
    showToast(
        'Bạn không có quyền xóa nhân viên!',
        'danger'
    );
    return;
    }
    const staff =
        findStaffById(staffId);

    if (!staff) {
        return;
    }

    const confirmed =
        confirm(
            `Bạn có chắc muốn xóa nhân viên ${staff.name} (${staff.id})?`
        );

    if (!confirmed) {
        return;
    }

    const { error } =
        await supabaseClient
            .from('staff')
            .delete()
            .eq('id', staffId);

    if (error) {
        console.error(
            'Lỗi xóa nhân viên:',
            error
        );

        showToast(
            'Không thể xóa nhân viên: ' +
            error.message,
            'danger'
        );

        return;
    }

    staffList =
        staffList.filter(
            staff =>
                staff.id !== staffId
        );

    // Nếu đang chọn người vừa bị xóa
    if (
        selectedStaff &&
        selectedStaff.id === staffId
    ) {
        selectedStaff = null;

        if (staffSelect) {
            staffSelect.value = '';
        }

        updateStaffPreview();
        updateCheckButtons();
    }

    renderStaffSelect();
    renderDepartmentFilter();
    renderStaffManagement();
    updateDashboardStats();

    showToast(
        'Đã xóa nhân viên.',
        'success'
    );
}


// ================= RESET DANH SÁCH NHÂN VIÊN =================

async function resetDefaultStaff() {
    const confirmed =
        confirm(
            'Bạn có chắc muốn khôi phục danh sách 35 nhân viên mặc định?'
        );

    if (!confirmed) {
        return;
    }

    const { error } =
        await supabaseClient
            .from('staff')
            .upsert(
                DEFAULT_STAFF,
                {
                    onConflict: 'id'
                }
            );

    if (error) {
        console.error(
            'Lỗi khôi phục nhân viên:',
            error
        );

        showToast(
            'Không thể khôi phục danh sách nhân viên!',
            'danger'
        );

        return;
    }

    // Xóa các nhân viên không nằm trong danh sách mặc định
    const defaultIds =
        DEFAULT_STAFF.map(
            staff => staff.id
        );

    const extraStaff =
        staffList.filter(
            staff =>
                !defaultIds.includes(
                    staff.id
                )
        );

    for (
        const staff of extraStaff
    ) {
        await supabaseClient
            .from('staff')
            .delete()
            .eq('id', staff.id);
    }

    staffList =
        [...DEFAULT_STAFF];

    selectedStaff = null;

    renderStaffSelect();
    renderDepartmentFilter();
    renderStaffManagement();
    updateDashboardStats();
    updateStaffPreview();
    updateCheckButtons();

    showToast(
        'Đã khôi phục 35 nhân viên mặc định.',
        'success'
    );
}


// ================= MỞ / ĐÓNG MODAL =================

function openStaffModal() {
    if (!staffModal) {
        return;
    }

    renderStaffManagement();

    staffModal.style.display =
        'flex';
}

function closeStaffModal() {
    if (!staffModal) {
        return;
    }

    staffModal.style.display =
        'none';
}


// ================= LỌC VÀ TÌM KIẾM =================

function handleEmployeeSearch() {
    const keyword =
        empSearchInput
            ? empSearchInput.value
            : '';

    renderStaffSelect(keyword);
}

function clearEmployeeSearch() {
    if (empSearchInput) {
        empSearchInput.value = '';
    }

    renderStaffSelect();
}

function handleTableSearch() {
    renderAttendanceTable();
}


// ================= XÓA BỘ LỌC =================

function clearFilters() {
    if (filterDateEl) {
        filterDateEl.value = '';
    }

    if (filterDeptEl) {
        filterDeptEl.value = '';
    }

    if (filterStatusEl) {
        filterStatusEl.value = '';
    }

    if (tableSearchInput) {
        tableSearchInput.value = '';
    }

    renderAttendanceTable();
    updateDashboardStats();
}
// ================= XÓA BẢN GHI CHẤM CÔNG =================

async function deleteAttendanceLog(logId) {
    if (!logId) {
        return;
    }

    const confirmed = confirm(
        'Bạn có chắc muốn xóa bản ghi chấm công này không?'
    );

    if (!confirmed) {
        return;
    }

    const { error } = await supabaseClient
        .from('attendance_logs')
        .delete()
        .eq('id', logId);

    if (error) {
        console.error(
            'Lỗi xóa bản ghi chấm công:',
            error
        );

        showToast(
            'Không thể xóa bản ghi: ' + error.message,
            'danger'
        );

        return;
    }

    attendanceLogs = attendanceLogs.filter(
        log => log.id !== logId
    );

    await loadAttendanceLogsFromSupabase();
    renderAttendanceTable();
    updateDashboardStats();
    updateStaffPreview();
    updateCheckButtons();

    showToast(
        'Đã xóa bản ghi chấm công.',
        'success'
    );
}
// ================= XUẤT FILE EXCEL / CSV =================

function exportToCSV() {

    const today =
        getFormattedCurrentDate();

    const filterDate =
        filterDateEl
            ? filterDateEl.value
            : '';

    const filterDept =
        filterDeptEl
            ? filterDeptEl.value
            : 'ALL';

    const filterStatus =
        filterStatusEl
            ? filterStatusEl.value
            : 'ALL';

    const searchTerm =
        tableSearchInput
            ? tableSearchInput.value
                .trim()
                .toLowerCase()
            : '';


    // ================= LỌC DỮ LIỆU =================

    const records =
        attendanceLogs.filter(log => {

            // Lọc ngày
            if (
                filterDate &&
                log.workDate !== filterDate
            ) {
                return false;
            }

            // Lọc khoa/phòng
            if (
                filterDept &&
                filterDept !== 'ALL' &&
                log.department !== filterDept
            ) {
                return false;
            }

            // Lọc trạng thái
            if (
                filterStatus === 'ON_DUTY' &&
                log.isCompleted
            ) {
                return false;
            }

            if (
                filterStatus === 'COMPLETED' &&
                !log.isCompleted
            ) {
                return false;
            }

            if (
                filterStatus === 'LATE' &&
                String(
                    log.status || ''
                ).toLowerCase() !== 'late'
            ) {
                return false;
            }

            if (
                filterStatus === 'ON_TIME' &&
                String(
                log.status || ''
                ).toLowerCase() !== 'present'
            ) {
                return false;
                }

            // Tìm kiếm
            if (searchTerm) {

                const content =
                    [
                        log.staffId,
                        log.staffName,
                        log.department,
                        log.role,
                        log.shift
                    ]
                        .filter(Boolean)
                        .join(' ')
                        .toLowerCase();

                if (
                    !content.includes(
                        searchTerm
                    )
                ) {
                    return false;
                }
            }

            return true;
        });


    // ================= KIỂM TRA DỮ LIỆU =================

    if (
        records.length === 0
    ) {

        showToast(
            'Không có dữ liệu chấm công phù hợp để xuất!',
            'warning'
        );

        return;
    }


    // ================= TẠO CSV =================

    // BOM UTF-8 để Excel hiển thị tiếng Việt đúng
    let csvContent =
        '\uFEFF';

    csvContent +=
        'BẢNG CHẤM CÔNG CÁN BỘ ' +
        'BỆNH VIỆN ĐA KHOA KHU VỰC CAI LẬY\n';

    csvContent +=
        `Ngày xuất báo cáo: ${today}\n`;

    if (filterDate) {
        csvContent +=
            `Ngày chấm công: ${filterDate}\n`;
    }

    if (
        filterDept &&
        filterDept !== 'ALL'
    ) {
        csvContent +=
            `Khoa/Phòng: ${filterDept}\n`;
    }

    csvContent += '\n';


    // Tiêu đề cột
    csvContent +=
        'STT;' +
        'Mã NV;' +
        'Họ và Tên;' +
        'Khoa / Phòng;' +
        'Chức vụ;' +
        'Ca Trực;' +
        'Ngày;' +
        'Giờ Vào;' +
        'Giờ Ra;' +
        'Tổng Giờ Trực;' +
        'Trạng Thái\n';

    // ================= DỮ LIỆU =================

    records.forEach(
        (log, index) => {

            let statusText;

            if (
                !log.isCompleted
            ) {

                statusText =
                    'Đang trực';

            } else if (
                String(
                    log.status || ''
                ).toLowerCase() ===
                'late'
            ) {

                statusText =
                    'Vào trễ';

            } else {

                statusText =
                    'Đúng giờ';
            }


            const row = [

                index + 1,

                log.staffId || '',

                log.staffName || '',

                log.department || '',

                log.role || '',

                log.shift ||
                    log.shiftKey ||
                    '',

                log.workDate || '',

                formatTimeOnly(
                    log.checkIn
                ),

                log.checkOut
                    ? formatTimeOnly(
                        log.checkOut
                    )
                    : 'Chưa ra',

                log.workHours
                    ? Number(
                        log.workHours
                    ).toFixed(2)
                    : '0',

                statusText

            ];


            csvContent +=
                row
                    .map(value => {

                        const text =
                            String(
                                value ?? ''
                            )
                                .replace(
                                    /"/g,
                                    '""'
                                );

                        return `"${text}"`;

                    })
                    .join(';') +
                '\n';
        }
    );


    // ================= TẠO FILE =================

    const blob =
        new Blob(
            [csvContent],
            {
                type:
                    'text/csv;charset=utf-8;'
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            'a'
        );


    link.href =
        url;


    link.download =
        `Bang_Cham_Cong_BVDKKV_Cai_Lay_${today}.csv`;


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );


    URL.revokeObjectURL(
        url
    );


    showToast(
        `Đã xuất ${records.length} bản ghi thành công!`,
        'success'
    );
}


// ================= ĐỊNH DẠNG GIỜ =================

function formatTimeOnly(value) {

    if (!value) {
        return '';
    }

    const text =
        String(value);

    // Nếu đã là HH:mm:ss
    if (
        /^\d{2}:\d{2}/.test(text)
    ) {
        return text.substring(
            0,
            8
        );
    }

    // Nếu là ISO datetime
    const date =
        new Date(value);

    if (
        isNaN(
            date.getTime()
        )
    ) {
        return text;
    }

    return (
        String(
            date.getHours()
        ).padStart(2, '0')
        +
        ':'
        +
        String(
            date.getMinutes()
        ).padStart(2, '0')
        +
        ':'
        +
        String(
            date.getSeconds()
        ).padStart(2, '0')
    );
}

// ================= GẮN SỰ KIỆN =================

function setupEventListeners() {

    // Chỉ gắn sự kiện một lần
    if (window.__attendanceEventsInitialized) {
        return;
    }

    window.__attendanceEventsInitialized = true;

    // Đồng hồ
    updateClock();

    setInterval(
        updateClock,
        1000
    );


    // ================= CHẤM CÔNG =================

    if (btnCheckIn) {
        btnCheckIn.addEventListener(
            'click',
            handleCheckIn
        );
    }

    if (btnCheckOut) {
        btnCheckOut.addEventListener(
            'click',
            handleCheckOut
        );
    }


    // ================= CHỌN NHÂN VIÊN =================

    if (staffSelect) {
        staffSelect.addEventListener(
            'change',
            handleStaffChange
        );
    }

    if (empSearchInput) {
        empSearchInput.addEventListener(
            'input',
            handleEmployeeSearch
        );
    }

    if (btnClearSearch) {
        btnClearSearch.addEventListener(
            'click',
            clearEmployeeSearch
        );
    }


    // ================= LỌC BẢNG =================

    if (filterDateEl) {
        filterDateEl.addEventListener(
            'change',
            renderAttendanceTable
        );
    }

    if (filterDeptEl) {
        filterDeptEl.addEventListener(
            'change',
            renderAttendanceTable
        );
    }

    if (filterStatusEl) {
        filterStatusEl.addEventListener(
            'change',
            renderAttendanceTable
        );
    }

    if (tableSearchInput) {
        tableSearchInput.addEventListener(
            'input',
            handleTableSearch
        );
    }
// ================= BÁO CÁO THỐNG KÊ =================

const btnGenerateReport =
    document.getElementById(
        'btnGenerateReport'
    );

const btnExportExcel =
    document.getElementById(
        'btnExportExcel'
    );

const btnClearReport =
    document.getElementById(
        'btnClearReport'
    );

if (btnGenerateReport) {

    btnGenerateReport.addEventListener(
        'click',
        generateAttendanceReport
    );
}
    if (btnExportExcel) {

    btnExportExcel.addEventListener(
        'click',
        exportAttendanceExcel
    );
}
if (btnClearReport) {

    btnClearReport.addEventListener(
        'click',
        clearAttendanceReport
    );
}
// ================= TÀI KHOẢN =================

if (btnLogout) {

    btnLogout.addEventListener(
        'click',
        handleLogout
    );
}
    // ================= BẢNG CHẤM CÔNG =================

    if (attendanceTableBody) {
        attendanceTableBody.addEventListener(
            'click',
            event => {

                const deleteButton =
                    event.target.closest(
                        '.btn-table-delete'
                    );

                if (!deleteButton) {
                    return;
                }

                const logId =
                    deleteButton.dataset.logId;

                if (logId) {
                    deleteAttendanceLog(
                        logId
                    );
                }
            }
        );
    }


    // ================= QUẢN LÝ NHÂN VIÊN =================

    if (btnOpenStaffModal) {
        btnOpenStaffModal.addEventListener(
            'click',
            openStaffModal
        );
    }

    if (btnCloseStaffModal) {
        btnCloseStaffModal.addEventListener(
            'click',
            closeStaffModal
        );
    }

    if (staffModal) {
        staffModal.addEventListener(
            'click',
            event => {

                if (
                    event.target ===
                    staffModal
                ) {
                    closeStaffModal();
                }

            }
        );
    }

    if (addStaffForm) {
        addStaffForm.addEventListener(
            'submit',
            async event => {

                event.preventDefault();

                await addStaff();

            }
        );
    }

    if (staffListTableBody) {
        staffListTableBody.addEventListener(
            'click',
            event => {

                const button =
                    event.target.closest(
                        '.btn-delete-staff'
                    );

                if (!button) {
                    return;
                }

                const staffId =
                    button.dataset.staffId;

                if (staffId) {
                    removeStaff(
                        staffId
                    );
                }

            }
        );
    }


// ================= XUẤT / IN =================

const exportButton =
    document.getElementById('btnexportToCSV');

if (exportButton) {
    exportButton.addEventListener(
        'click',
        exportToCSV
    );
}


const printButton =
    document.getElementById('btnPrintReport');

if (printButton) {
    printButton.addEventListener(
        'click',
        printReport
    );
}

// Tương thích với tên hàm cũ
function exportCSV() {
    return exportToCSV();
}
// ================= IN BẢNG CÔNG =================

function printReport() {

    const tableBody =
        document.getElementById('attendanceTableBody');

    if (!tableBody) {
        alert('Không tìm thấy bảng chấm công.');
        return;
    }

    const originalTable =
        tableBody.closest('table');

    if (!originalTable) {
        alert('Không tìm thấy dữ liệu chấm công.');
        return;
    }

    const printTable =
        originalTable.cloneNode(true);

    // Xóa cột Thao tác
    printTable
        .querySelectorAll('tr')
        .forEach(row => {

            if (row.lastElementChild) {
                row.lastElementChild.remove();
            }

        });


    const printWindow =
        window.open(
            '',
            '_blank',
            'width=1200,height=800'
        );

    if (!printWindow) {
        alert(
            'Trình duyệt đang chặn cửa sổ in. Hãy cho phép popup.'
        );
        return;
    }


    const today =
        new Date().toLocaleDateString('vi-VN');


    printWindow.document.write(`
<!DOCTYPE html>

<html lang="vi">

<head>

<meta charset="UTF-8">

<title>
Bảng chấm công - BVĐK Khu vực Cai Lậy
</title>

<style>

@page {
    size: A4 landscape;
    margin: 12mm;
}

body {
    font-family: Arial, sans-serif;
    font-size: 12px;
    color: #111;
}

.header {
    text-align: center;
    margin-bottom: 20px;
}

.hospital {
    font-size: 20px;
    font-weight: bold;
    text-transform: uppercase;
}

.title {
    font-size: 17px;
    font-weight: bold;
    margin-top: 8px;
    text-transform: uppercase;
}

.info {
    margin-bottom: 12px;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    border: 1px solid #555;
    padding: 7px 5px;
    text-align: center;
}

th {
    background: #e5e7eb;
    font-weight: bold;
}

.footer {
    display: flex;
    justify-content: space-between;
    text-align: center;
    margin-top: 40px;
}

.signature {
    width: 30%;
}

.space {
    height: 60px;
}

</style>

</head>

<body>

<div class="header">

    <div class="hospital">
        BỆNH VIỆN ĐA KHOA KHU VỰC CAI LẬY
    </div>

    <div class="title">
        BẢNG CHẤM CÔNG CÁN BỘ Y TẾ
    </div>

</div>

<div class="info">
    Ngày in:
    <strong>${today}</strong>
</div>

${printTable.outerHTML}

<div class="footer">

    <div class="signature">
        <strong>NGƯỜI LẬP BẢNG</strong>
        <div class="space"></div>
        (Ký, ghi rõ họ tên)
    </div>

    <div class="signature">
        <strong>NGƯỜI KIỂM TRA</strong>
        <div class="space"></div>
        (Ký, ghi rõ họ tên)
    </div>

    <div class="signature">
        <strong>THỦ TRƯỞNG ĐƠN VỊ</strong>
        <div class="space"></div>
        (Ký, ghi rõ họ tên, đóng dấu)
    </div>

</div>

<script>

window.onload = function() {
    setTimeout(function() {
        window.print();
    }, 500);
};

</script>

</body>

</html>
    `);

    printWindow.document.close();
}
    // ================= ESC ĐÓNG MODAL =================

    document.addEventListener(
        'keydown',
        event => {

            if (
                event.key === 'Escape'
            ) {
                closeStaffModal();
            }

        }
    );
}


// ================= KHỞI ĐỘNG HỆ THỐNG =================

async function initializeApp() {

    try {

        const authenticated =
            await checkAuth();

        if (!authenticated) {

            console.log(
                'Chưa đăng nhập. Đang chờ người dùng đăng nhập...'
            );

            return;
        }

        await loadData();

        renderStaffSelect();

        renderShiftSelect();

        renderDepartmentFilter();

        renderAttendanceTable();

        renderStaffManagement();

        updateDashboardStats();

        updateStaffPreview();

        updateCheckButtons();

        setupEventListeners();
        setupAttendanceRealtime();

        console.log(
            'Hệ thống chấm công đã khởi động thành công.'
        );

    } catch (error) {

        console.error(
            'Lỗi khởi động hệ thống:',
            error
        );

        showToast(
            'Có lỗi khi khởi động hệ thống. Vui lòng kiểm tra Console.',
            'danger'
        );
    }
}

// ================= LẮNG NGHE TRẠNG THÁI ĐĂNG NHẬP =================

supabaseClient.auth.onAuthStateChange(
    (event, session) => {

        console.log(
    'Auth event:',
    event
);

            if (
        session &&
        (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')
        ) {
        setTimeout(() => {
        loadCurrentUserProfile(session);
            }, 0);
        }

        // Người dùng chủ động đăng xuất
        if (event === 'SIGNED_OUT') {

            if (loginScreen) {
                loginScreen.style.display = 'flex';
            }

            return;
        }

        // Đăng nhập thành công
        if (event === 'SIGNED_IN') {

            if (loginScreen) {
                loginScreen.style.display = 'none';
            }

            return;
        }

        // Khôi phục phiên khi F5 / mở lại trang
        if (event === 'INITIAL_SESSION') {

            if (session) {

                console.log(
                    'Đã khôi phục phiên đăng nhập.'
                );

                if (loginScreen) {
                    loginScreen.style.display = 'none';
                }

            } else {

                console.log(
                    'Không có phiên đăng nhập.'
                );

                if (loginScreen) {
                    loginScreen.style.display = 'flex';
                }
            }

            return;
        }
    }
);

        // Khi đăng nhập thành công
        if (event === 'SIGNED_IN') {

            if (loginScreen) {
                loginScreen.style.display = 'none';
            }

        }

// ================= CHẠY ỨNG DỤNG =================

if (
    document.readyState === 'loading'
) {

    document.addEventListener(
        'DOMContentLoaded',
        initializeApp
    );

} else {

    initializeApp();

}
// ================= BIỂU ĐỒ THỐNG KÊ =================

function renderCharts() {

    renderDepartmentChart();

    renderAttendanceSummaryChart();
}


// ================= BIỂU ĐỒ NHÂN SỰ THEO KHOA / PHÒNG =================

function renderDepartmentChart() {

    const chart =
        document.getElementById('departmentChart');

    if (!chart) {
        return;
    }

    const departments =
        [...new Set(
            staffList
                .map(staff => staff.department)
                .filter(Boolean)
        )].sort();

    if (departments.length === 0) {

        chart.innerHTML = `
            <div style="
                text-align:center;
                padding:60px 20px;
                color:#777;
            ">
                Chưa có dữ liệu nhân sự
            </div>
        `;

        return;
    }

    const maxCount =
        Math.max(
            ...departments.map(
                department =>
                    staffList.filter(
                        staff =>
                            staff.department === department
                    ).length
            ),
            1
        );

    chart.innerHTML =
        departments.map(department => {

            const count =
                staffList.filter(
                    staff =>
                        staff.department === department
                ).length;

            const percent =
                (count / maxCount) * 100;

            return `
                <div class="department-chart-item">

                    <div class="department-chart-name">
                        ${department}
                    </div>

                    <div class="department-chart-bar">

                        <div
                            class="department-chart-fill"
                            style="width:${percent}%"
                        ></div>

                    </div>

                    <div class="department-chart-value">
                        ${count}
                    </div>

                </div>
            `;
        }).join('');
}


// ================= BIỂU ĐỒ TÌNH TRẠNG CHẤM CÔNG =================

function renderAttendanceSummaryChart() {

    const chart =
        document.getElementById(
            'attendanceSummaryChart'
        );

    if (!chart) {
        return;
    }

    const today =
        getFormattedCurrentDate();

    const todayLogs =
        attendanceLogs.filter(
            log =>
                log.workDate === today
        );

    const totalStaff =
        staffList.length;

    const checkedIn =
        todayLogs.filter(
            log =>
                !!log.checkIn
        ).length;

    const onDuty =
        todayLogs.filter(
            log =>
                !!log.checkIn &&
                !log.checkOut &&
                log.isCompleted !== true
        ).length;

    const late =
        todayLogs.filter(
            log =>
                String(log.status || '')
                    .toLowerCase() === 'late'
        ).length;

    const completed =
        todayLogs.filter(
            log =>
                log.isCompleted === true ||
                !!log.checkOut
        ).length;

    const notCheckedIn =
        Math.max(
            totalStaff - checkedIn,
            0
        );

    const data = [
        {
            label: 'Đã chấm công',
            value: checkedIn
        },
        {
            label: 'Đang trực',
            value: onDuty
        },
        {
            label: 'Đi muộn',
            value: late
        },
        {
            label: 'Đã kết thúc',
            value: completed
        },
        {
            label: 'Chưa chấm',
            value: notCheckedIn
        }
    ];

    const maxValue =
        Math.max(
            ...data.map(item => item.value),
            1
        );

    chart.innerHTML =
        data.map(item => {

            const percent =
                (item.value / maxValue) * 100;

            return `
                <div class="summary-chart-item">

                    <div class="summary-chart-label">
                        ${item.label}
                    </div>

                    <div class="summary-chart-bar">

                        <div
                            class="summary-chart-fill"
                            style="
                                width:${percent}%;
                                background:#0f9d8a;
                            "
                        ></div>

                    </div>

                    <div class="summary-chart-value">
                        ${item.value}
                    </div>

                </div>
            `;
        }).join('');
}
// ================= BÁO CÁO THỐNG KÊ =================

function generateAttendanceReport() {

    const fromDateEl =
        document.getElementById('reportFromDate');

    const toDateEl =
        document.getElementById('reportToDate');

    const fromDate =
        fromDateEl ? fromDateEl.value : '';

    const toDate =
        toDateEl ? toDateEl.value : '';

    if (!fromDate || !toDate) {

        showToast(
            'Vui lòng chọn đầy đủ từ ngày và đến ngày!',
            'warning'
        );

        return;
    }

    if (fromDate > toDate) {

        showToast(
            'Từ ngày không được lớn hơn đến ngày!',
            'warning'
        );

        return;
    }

    const reportLogs =
        attendanceLogs.filter(log => {

            if (!log.workDate) {
                return false;
            }

            return (
                log.workDate >= fromDate &&
                log.workDate <= toDate
            );
        });

    renderAttendanceReport(reportLogs);
}


// ================= HIỂN THỊ BÁO CÁO =================

function renderAttendanceReport(reportLogs) {

    const tableBody =
        document.getElementById(
            'reportTableBody'
        );

    if (!tableBody) {
        return;
    }

    // Tổng lượt chấm công
    const totalLogs =
        reportLogs.length;

    // Đúng giờ
    const onTime =
        reportLogs.filter(
            log =>
                String(log.status || '')
                    .toLowerCase() === 'present'
        ).length;

    // Đi muộn
    const late =
        reportLogs.filter(
            log =>
                String(log.status || '')
                    .toLowerCase() === 'late'
        ).length;

    // Đã kết thúc
    const completed =
        reportLogs.filter(
            log =>
                log.isCompleted === true ||
                !!log.checkOut
        ).length;

    // Tổng giờ
    const totalHours =
        reportLogs.reduce(
            (total, log) => {

                const hours =
                    Number(log.workHours);

                if (Number.isFinite(hours)) {
                    return total + hours;
                }

                return total;
            },
            0
        );

    // Cập nhật các ô tổng hợp
    const totalLogsEl =
        document.getElementById(
            'reportTotalLogs'
        );

    const onTimeEl =
        document.getElementById(
            'reportOnTime'
        );

    const lateEl =
        document.getElementById(
            'reportLate'
        );

    const completedEl =
        document.getElementById(
            'reportCompleted'
        );

    const totalHoursEl =
        document.getElementById(
            'reportTotalHours'
        );

    if (totalLogsEl) {
        totalLogsEl.textContent =
            totalLogs;
    }

    if (onTimeEl) {
        onTimeEl.textContent =
            onTime;
    }

    if (lateEl) {
        lateEl.textContent =
            late;
    }

    if (completedEl) {
        completedEl.textContent =
            completed;
    }

    if (totalHoursEl) {
        totalHoursEl.textContent =
            totalHours.toFixed(2);
    }


    // Không có dữ liệu
    if (reportLogs.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td
                    colspan="10"
                    style="text-align:center;"
                >
                    Không có dữ liệu chấm công
                    trong khoảng thời gian đã chọn
                </td>
            </tr>
        `;

        return;
    }


    // Hiển thị dữ liệu
    tableBody.innerHTML =
        reportLogs.map(
            (log, index) => {

                let statusText = '--';

                if (!log.isCompleted) {

                    statusText =
                        'Đang trực';

                } else if (
                    String(log.status || '')
                        .toLowerCase() === 'late'
                ) {

                    statusText =
                        'Đi muộn';

                } else {

                    statusText =
                        'Đúng giờ';
                }


                const workHours =
                    Number(log.workHours);

                const hours =
                    Number.isFinite(workHours)
                        ? workHours.toFixed(2)
                        : '0.00';


                return `
                    <tr>

                        <td>
                            ${index + 1}
                        </td>

                        <td>
                            ${log.workDate || '--'}
                        </td>

                        <td>
                            ${log.staffId || '--'}
                        </td>

                        <td>
                            ${log.staffName || '--'}
                        </td>

                        <td>
                            ${log.department || '--'}
                        </td>

                        <td>
                            ${log.shift || '--'}
                        </td>

                        <td>
                            ${formatDateTime(log.checkIn)}
                        </td>

                        <td>
                            ${formatDateTime(log.checkOut)}
                        </td>

                        <td>
                            ${statusText}
                        </td>

                        <td>
                            <strong>
                                ${hours}
                            </strong>
                        </td>

                    </tr>
                `;
            }
        ).join('');
}


// ================= XÓA BÁO CÁO =================

function clearAttendanceReport() {

    const fromDateEl =
        document.getElementById(
            'reportFromDate'
        );

    const toDateEl =
        document.getElementById(
            'reportToDate'
        );

    const tableBody =
        document.getElementById(
            'reportTableBody'
        );

    if (fromDateEl) {
        fromDateEl.value = '';
    }

    if (toDateEl) {
        toDateEl.value = '';
    }

    if (tableBody) {

        tableBody.innerHTML = `
            <tr>
                <td
                    colspan="10"
                    style="text-align:center;"
                >
                    Chọn khoảng thời gian và nhấn
                    "Xem báo cáo"
                </td>
            </tr>
        `;
    }

    const ids = [
        'reportTotalLogs',
        'reportOnTime',
        'reportLate',
        'reportCompleted'
    ];

    ids.forEach(id => {

        const element =
            document.getElementById(id);

        if (element) {
            element.textContent = '0';
        }

    });

    const totalHoursEl =
        document.getElementById(
            'reportTotalHours'
        );

    if (totalHoursEl) {
        totalHoursEl.textContent = '0.00';
    }
}
// ================= XUẤT EXCEL =================

function exportAttendanceExcel() {

    const fromDateEl =
        document.getElementById(
            'reportFromDate'
        );

    const toDateEl =
        document.getElementById(
            'reportToDate'
        );

    const fromDate =
        fromDateEl ? fromDateEl.value : '';

    const toDate =
        toDateEl ? toDateEl.value : '';

    if (!fromDate || !toDate) {

        showToast(
            'Vui lòng chọn khoảng thời gian trước khi xuất Excel!',
            'warning'
        );

        return;
    }

    if (fromDate > toDate) {

        showToast(
            'Từ ngày không được lớn hơn đến ngày!',
            'warning'
        );

        return;
    }

    const reportLogs =
        attendanceLogs.filter(log => {

            if (!log.workDate) {
                return false;
            }

            return (
                log.workDate >= fromDate &&
                log.workDate <= toDate
            );
        });

    if (reportLogs.length === 0) {

        showToast(
            'Không có dữ liệu để xuất Excel!',
            'warning'
        );

        return;
    }


    const excelData =
        reportLogs.map(
            (log, index) => {

                let statusText =
                    'Đang trực';

                if (
                    log.isCompleted === true ||
                    !!log.checkOut
                ) {

                    if (
                        String(log.status || '')
                            .toLowerCase() === 'late'
                    ) {

                        statusText =
                            'Đi muộn';

                    } else {

                        statusText =
                            'Đúng giờ';
                    }
                }

                const hours =
                    Number(log.workHours);

                return {

                    'STT':
                        index + 1,

                    'Ngày':
                        log.workDate || '',

                    'Mã nhân viên':
                        log.staffId || '',

                    'Họ và tên':
                        log.staffName || '',

                    'Khoa / Phòng':
                        log.department || '',

                    'Chức vụ':
                        log.role || '',

                    'Ca trực':
                        log.shift || '',

                    'Giờ vào':
                        formatDateTime(
                            log.checkIn
                        ),

                    'Giờ ra':
                        formatDateTime(
                            log.checkOut
                        ),

                    'Trạng thái':
                        statusText,

                    'Tổng giờ làm':
                        Number.isFinite(hours)
                            ? hours
                            : 0
                };
            }
        );


    // Tạo Sheet
    const worksheet =
        XLSX.utils.json_to_sheet(
            excelData
        );


    // Độ rộng cột
    worksheet['!cols'] = [
        { wch: 6 },
        { wch: 14 },
        { wch: 16 },
        { wch: 25 },
        { wch: 24 },
        { wch: 20 },
        { wch: 22 },
        { wch: 22 },
        { wch: 22 },
        { wch: 16 },
        { wch: 16 }
    ];


    // Tạo Workbook
    const workbook =
        XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        'Bao cao cham cong'
    );


    // Tên file
    const fileName =
        `Bao_cao_cham_cong_${fromDate}_${toDate}.xlsx`;


    // Xuất file
    XLSX.writeFile(
        workbook,
        fileName
    );


    showToast(
        'Đã xuất báo cáo Excel thành công!',
        'success'
    );
}
// ================= TÀI KHOẢN HIỆN TẠI =================

function updateCurrentUser(session) {

    if (!session || !session.user) {
        return;
    }

    const email =
        session.user.email || 'Người dùng';

    if (currentUserEmail) {
        currentUserEmail.textContent =
            email;
    }

    if (currentUserRole) {
        currentUserRole.textContent =
            'Quản trị viên';
    }
}


// ================= ĐĂNG XUẤT =================

async function handleLogout() {

    const confirmed =
        confirm(
            'Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?'
        );

    if (!confirmed) {
        return;
    }

    const { error } =
        await supabaseClient.auth.signOut();

    if (error) {

        console.error(
            'Lỗi đăng xuất:',
            error
        );

        showToast(
            'Không thể đăng xuất!',
            'danger'
        );

        return;
    }

    if (currentUserEmail) {
        currentUserEmail.textContent =
            'Người dùng';
    }

    if (currentUserRole) {
        currentUserRole.textContent =
            'Chưa đăng nhập';
    }

    loginScreen.style.display =
        'flex';

    showToast(
        'Đã đăng xuất khỏi hệ thống.',
        'success'
    );
}