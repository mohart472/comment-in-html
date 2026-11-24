// ============================================================
//  عدد الدروس لكل كورس
//  غيّر الرقم هنا بس، وهيتغير في كل مكان بيظهر فيه:
//    - كارت الكورس في الصفحة الرئيسية ("12 lessons")
//    - صفحة الكورس ("12 lessons")
//    - صفحات الدروس ("Lesson 2 of 12")
// ============================================================

window.JUNIOR_COURSES = {
  html: { lessons: 14 },
  css:  { lessons: 15 },
  js:   { lessons: 20 },
  py:   { lessons: 18 },
  git:  { lessons: 8 },
  sql:  { lessons: 14 }
};


// ============================================================
//  النقط اللي بياخدها الطالب لما يخلّص تحدي (حسب أهمية الدرس)
//  غيّر الأرقام زي ما تحب. اسم التحدي = كورس-رقم الدرس
// ============================================================

window.JUNIOR_POINTS = {
  'html-1': 10,  // What is HTML?
  'html-2': 20,  // Page structure (أهم درس: هيكل أي صفحة)
  'html-3': 10,  // Comments
  'html-4': 15,  // Text formatting
  'html-5': 15   // Images
};

// ===== مفيش حاجة تتغير تحت الخط ده =====
(function () {
  var courses = window.JUNIOR_COURSES;

  document.querySelectorAll('[data-lessons]').forEach(function (el) {
    var course = courses[el.getAttribute('data-lessons')];
    if (course && typeof course.lessons === 'number') {
      el.textContent = course.lessons;
    }
  });

  document.querySelectorAll('[data-points]').forEach(function (el) {
    var points = window.JUNIOR_POINTS[el.getAttribute('data-points')];
    if (typeof points === 'number') {
      el.textContent = points;
    }
  });
})();
