// تقدّم الدروس: بيحفظ الدروس والتحديات اللي خلّصتها جوه المتصفح (localStorage)
//  - صفحة الدرس: لما تنزل لآخر الصفحة الدرس بيتعلّم إنك قرأته لوحده (من غير زرار)
//  - التحدي بيتعلّم لما تدوس Finish في المحرر بعد ما تحله
//  - صفحة الكورس: الدايرة جنب كل درس
//        فاضية         = لا قرأت الدرس ولا حليت التحدي
//        نص حدودها أخضر = عملت واحد منهم بس
//        خضرا كاملة وعلامة صح بيضا = قرأت الدرس وحليت التحدي
// الدرس بيتعرّف باسم ملفه (data-lesson="html-lesson-1") والتحدي باسمه (html-1).

(function () {
  var LESSONS_KEY = 'junior-code-progress-v1';
  var CHALLENGES_KEY = 'junior-code-challenges-v1';

  function readJson(key) {
    try { return JSON.parse(localStorage.getItem(key)) || {}; } catch (e) { return {}; }
  }

  function writeJson(key, data) {
    try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) {}
  }

  function isLessonRead(id) {
    return readJson(LESSONS_KEY)[id] === true;
  }

  function markLessonRead(id) {
    var data = readJson(LESSONS_KEY);
    data[id] = true;
    writeJson(LESSONS_KEY, data);
  }

  // html-lesson-3  ->  html-3
  function challengeIdFor(lessonId) {
    return lessonId.replace('-lesson-', '-');
  }

  var challengesDone = readJson(CHALLENGES_KEY);

  // ===== صفحة الكورس: الدواير =====
  document.querySelectorAll('li.lesson[data-lesson]').forEach(function (li) {
    var id = li.getAttribute('data-lesson');
    var read = isLessonRead(id);
    var challenge = challengesDone[challengeIdFor(id)] === true;
    var steps = (read ? 1 : 0) + (challenge ? 1 : 0);

    li.classList.toggle('half', steps === 1);
    li.classList.toggle('done', steps === 2);

    var label = 'Not completed';
    if (steps === 1) label = read ? 'Lesson read, challenge not done' : 'Challenge done, lesson not read';
    if (steps === 2) label = 'Completed';

    var status = li.querySelector('.lesson-status');
    if (status) status.setAttribute('aria-label', label);
  });

  // ===== صفحة الدرس: علامة "اكتمل" على صندوق التحدي =====
  document.querySelectorAll('.challenge-box[data-challenge]').forEach(function (box) {
    if (challengesDone[box.getAttribute('data-challenge')] === true) {
      box.classList.add('done');
    }
  });

  // ===== صفحة الدرس: قراءة الدرس بتتسجّل لما توصل لآخر الصفحة =====
  var page = document.querySelector('.lesson-page[data-lesson]');
  if (page) {
    var lessonId = page.getAttribute('data-lesson');

    if (!isLessonRead(lessonId)) {
      var check = function () {
        var reachedEnd = window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight - 4;
        if (!reachedEnd) return;

        markLessonRead(lessonId);
        window.removeEventListener('scroll', check);
        window.removeEventListener('resize', check);
      };

      window.addEventListener('scroll', check, { passive: true });
      window.addEventListener('resize', check);
      check();
    }
  }
})();
