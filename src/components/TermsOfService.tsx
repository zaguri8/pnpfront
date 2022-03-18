import { useLanguage } from "../context/Language"
import { TERMS_OF_SERVICE, SIDE } from "../settings/strings"
import SectionTitle from "./SectionTitle"
import { InnerPageHolder } from "./utilities/Holders"


export default function TermsOfService() {
    const { lang } = useLanguage()
    return <div dir={SIDE(lang)} id='copyrights'>
        <SectionTitle title={TERMS_OF_SERVICE(lang)} style={{}} />
        <InnerPageHolder style={{ maxWidth: '65%', width: '65%', marginLeft: 'auto', marginRight: 'auto' }}>

            {lang === 'heb' ?
                <div style={{ maxWidth: '500px', minWidth: '320px' }}>
                    <p>תקנון, תנאי שימוש ומדיניות פרטיות לאתר "Pick N Pull"</p>
                    <p>Pick N Pull מברכים את בחירתכם לגלוש באתר האינטרנט המופעל על ידה בכתובת: www.Pick - N - Pull.co.il("האתר"). </p>
                    <p>האתר מספק פלטפורמה אינטרנטית לקהל הלקוחות של האתר להזמנה ולרכישה נוחה ובטוחה של שירותי הסעות לכל מטרה לרבות אירועים, פסטיבלים וכיו"ב ("השירותים") ממיטב הנהגים ובעלי המקצוע בתחום ההסעות ("נותני השירות"). כמו כן ניתן למצוא באתר מידע אודות אופן השימוש בשירותי האתר, עלויות ועוד ("המוצרים").</p>
                    <p>כללי:</p>
                    <p>	•	הגלישה באתר כפופה לתנאים המפורטים בתקנון ותנאי שימוש אלו(״התקנון״).אנא קרא את התקנון בקפידה, שכן הגלישה באתר וביצוע פעולות בו מעידים על הסכמתך לתנאים הכלולים בתקנון.כמו כן, האתר שומר את זכותו לשנות את תנאי התקנון, מעת לעת, על פי שיקול דעתו הבלעדי וללא הודעה מוקדמת.מועד החלת השינוי כאמור יהיה מרגע פרסומו באתר.</p>
                    <p>	•	האמור בתקנון זה מתייחס באופן שווה לבני שני המינים והשימוש בלשון זכר או נקבה הוא מטעמי נוחות בלבד.</p>
                    <p>	•	תנאי התקנון חלים על שימוש באתר ובתכנים הכלולים בו באמצעות כל מחשב או מכשיר תקשורת אחר(כדוגמת טלפון סלולרי, מחשבי טאבלט וכיו"ב). כמו כן הם חלים על השימוש באתר, בין באמצעות רשת האינטרנט ובין באמצעות כל רשת או אמצעי תקשורת אחרים.</p>
                    <p>	•	הגלישה באתר מותרת בכל גיל.הרכישה באתר מיועדת לבעלי כשירות משפטית מגיל 18 בלבד.רכישה של קטין מתחת לגיל 18 מחייבת אישור הורה או אפוטרופוס. </p>
                    <p>	•	במקרה שייקבע כי הוראה בתקנון זה אינה ניתנת לאכיפה או שהינה חסרת תוקף מטעם כלשהו, לא יהא בכך כדי להשפיע או לפגוע בחוקיותן, תקפותן ואכיפתן של שאר הוראות התקנון.</p>
                    <p>	•	הגלישה באתר:</p>
                    <p>	•	הגלישה באתר והעיון בו אינם דורשים הרשמה, והוא פתוח לכל גולש.עם זאת, ישנן פעולות המצריכות רישום והזדהות, כפי שיפורט לעיל.  </p>
                    <p>	•	בעת רישום ו / או רכישה באתר יתבקש הגולש למסור פרטים אישיים כגון: שם פרטי, שם משפחה, כתובת, טלפון וכן כתובת דואר אלקטרוני פעילה(לשיקול דעתו של האתר).מסירת פרטים חלקיים או שגויים עלולים למנוע את האפשרות להשתמש בשירות ולסכל יצירת קשר במקרה הצורך.במקרה של שינוי פרטים יש לעדכנם באתר.</p>
                    <p>	•	מובהר כי אין חובה על - פי חוק למסור את המידע, אולם בלא למוסרו לא ניתן יהיה לרכוש באתר או להשתמש בשירותי האתר.</p>
                    <p>	•	האתר לא יעשה בפרטים שנמסרו שימוש, אלא בהתאם למדיניות הפרטיות של האתר המהווה חלק בלתי נפרד מתקנון זה.</p>
                    <p>	•	השארת פרטים ו / או רכישה באתר, בכפוף להסכמת הגולש, כוללת, בין היתר, קבלת תוכן שיווקי, מידע ביחס למבצעים, עדכונים והנחות המוצעים למשתמשים רשומים. </p>
                    <p>	•	האתר רשאי לקבוע, מעת לעת, דרכי זיהוי לכניסה לאתר ובכלל זה התחברות לאתר דרך הפייסבוק ו / או גוגל ו / או רשת חברתית אחרת ו / או פלטפורמה אחרת.</p>
                    <p>	•	האתר רשאי למנוע מכל גולש שימוש באתר לפי שיקול דעתו המוחלט.מבלי לגרוע מהאמור לעיל, רשאי האתר לחסום גישתו אליו בכל אחד מהמקרים הבאים:</p>
                    <p>	•	אם בעת השארת פרטים ו / או רכישה באתר נמסרו במתכוון פרטים שגויים;</p>
                    <p>	•	במקרה שנעשה שימוש באתר לביצוע או כדי לנסות לבצע מעשה בלתי חוקי על - פי דיני מדינת ישראל, או מעשה הנחזה על פניו כבלתי חוקי כאמור, או כדי לאפשר, להקל, לסייע או לעודד ביצועו של מעשה כזה;</p>
                    <p>	•	אם הופרו תנאי תקנון זה;</p>
                    <p>	•	במקרה שנעשה שימוש באתר בניסיון להתחרות באתר;</p>
                    <p>	•	אם נעשתה על ידי גולש כל פעולה שתמנע מאחרים לגלוש ולהשתמש באתר בכל דרך שהיא.</p>
                    <p>	•	השירותים המוצעים לרכישה באתר:</p>
                    <p>	•	שירותי האתר המוצעים לרכישה יופיעו בדפי האתר.</p>
                    <p>	•	האתר אינו מחויב, בכל דרך שהיא, לקיים מגוון כלשהו של שירותים.</p>
                    <p>	•	האתר רשאי בכל עת לשנות את מגוון השירותים המוצעים לרכישה באתר, להחליפם להמעיט מהם, להוסיף עליהם, ללא כל הודעה או התראה מוקדמת.</p>
                    <p>	•	אופן הצגת השירותים באתר הינו על - פי שיקול דעתו הבלעדי של האתר, ולנותני השירות לא תהיה כל טענה בעניין זה.</p>
                    <p>	•	הרכישה באתר מיועדת ללקוחות פרטיים בלבד לשימוש שאינו מסחרי, לרכישה לשימוש מסחרי כאמור יש ליצור קשר עם האתר לפי הפרטים המופיעים מטה.</p>
                    <p>	•	רכישת שירות באתר:</p>
                    <p>	•	ניתן לרכוש שירותים המופיעים באתר באופן נוח ומאובטח באמצעות האתר. </p>
                    <p>	•	רכישת שירותים באתר תתבצע באמצעות תשלום עבור השירות דרך האתר. </p>
                    <p>	•	בעת הזמנת שירות באתר, האתר יבצע בדיקה לזמינות השירות המוזמן מול נותני השירות, ולאחר קבלת השירות יתבצע חיוב עבור השירות שניתן.</p>
                    <p>	•	עם אישור ההזמנה ישלח מייל אישור הזמנה ללקוח עם פרטי ההזמנה.</p>
                    <p>	•	ככל ולא ימצא נותן שירותים זמין לאספקת השירות, האתר יודיע על כך ללקוח והלקוח לא יחויב. </p>
                    <p>	•	המחירים המופיעים בצמוד לשירותים באתר הם המחירים העדכניים.</p>
                    <p>	•	בנוסף להוראות התקנון יחולו על ההתקשרות עם נותן השירותים גם הוראות תקנון ומדיניות נותן השירותים.</p>
                    <p>	•	על אף האמור לעיל, האתר שומר לעצמו את הזכות לקבוע הסדרי תשלום אחרים ללקוחות ונרשמים והכל על - פי שיקול דעתו הבלעדי.</p>
                    <p>	•	מדיניות אספקת שירותים: </p>
                    <p>	•	האתר ידאג לאספקת הזמנת השירותים שבוצעה באתר במועד ובמקום עליו יסכימו הצדדים בעת ביצוע ההזמנה באתר.</p>
                    <p>	•	האתר לא יהיה אחראי לכל איחור ו / או עיכוב באספקה ו / או אי - אספקה, שיגרם כתוצאה של:</p>
                    <p>	•	 כוח עליון ו / או מאירועים שאינם בשליטת האתר;</p>
                    <p>	•	מסיבות הקשורות בנותני השירותים;</p>
                    <p>	•	סגירת המשק כך שפעילות האתר ו / או נותני השירותים ו / או ספקיו ו / או נותני שירותיו יפגעו, מכל סיבה שהיא.</p>
                    <p>	•	על הלקוח לעדכן את האתר ואת העסק מספק השירות בגין כל שינוי בפרטי הזמנת השירות שבוצעה באתר בהקדם האפשרי.</p>
                    <p>	•	מדיניות החזר, שינוי וביטול הזמנות:</p>
                    <p>	•	בקשה להחזר, שינוי או ביטול עסקה יועברו לאתר באחד מאמצעי ההתקשרות המופיעים בתחתית התקנון. </p>
                    <p>	•	שינוי או ביטול הזמנת שירותים, יתאפשרו בתוך 14 ימים מיום ביצוע העסקה או ממועד קבלת פרטי העסקה(לפי המאוחר), ובתנאי שביטול כאמור ייעשה לפחות שני ימים, שאינם ימי מנוחה, קודם למועד שבו נקבע מתן השירות.</p>
                    <p>	•	ההחזר הכספי יעשה באמצעי התשלום שבו ביצע הלקוח את ההזמנה.</p>
                    <p> •	האתר רשאי לבטל עסקה והסעה על פי שיקולו ומחוייב לתת החזר כספי ללקוח המשלם</p>
                    <p>	•	במקרה של ביטול שירותים שהוזמנו כאמור, יגבו דמי ביטול בגובה 5 % מסכום השירות או בסך 100 ש״ח(לפי הנמוך מבניהם).</p>
                    <p>	•	האמור בתקנון זה ובסעיף 6 לעיל כפוף להוראות חוק הגנת הצרכן, התשמ"א-1981.</p>
                    <p>	•	אחריות האתר:</p>
                    <p>	•	אין לראות במידע המופיע באתר משום הבטחה לתוצאה כלשהי ו / או אחריות לאופן הפעילויות של השירותים המסופקים בו או על ידי נותני השירותים.האתר לא יהיה אחראי לשום נזק, ישיר או עקיף, אשר ייגרם לגולש כתוצאה מהסתמכות על מידע המופיע באתר ו / או בקישורים לאתרים אחרים ו / או כל מקור מידע פנימי ו / או חיצוני אחר ו / או שימוש במוצרים ו / או בשירותים אשר מוצגים על ידו.</p>
                    <p>	•	אחריות האתר לשירות מוגבלת לשווי השירות.החבות הכוללת של האתר ביחס לכל שירות לא תעלה בשום מקרה על מחיר הרכישה של אותו שירות.</p>
                    <p>	•	לקוחות האתר מאשרים ומצהירים כי הם יישאו באחריות לפנות ולדרוש מנותני השירותים פיצוי בגין כל נזק, ישיר או עקיף, אשר ייגרם להם בעקבות שימוש בשירות. </p>
                    <p>	•	תמונות השירותים באתר מוצגות לצורכי המחשה בלבד.ייתכנו הבדלים במראה, בגוון, בגודל, וכיו"ב בין המוצר ו/או השירות, כפי שהוא מוצג באתר, לבין המוצר ו/או השירות שיסופק ללקוח. טעות סופר בתיאור מוצר ו/או שירות ו/או מחירו לא תחייב את האתר.</p>
                    <p>	•	מידע ומצגים אודות מוצרים ושירותים המוצגים באתר, שמקורם בעסקים שמוצריהם ו / או שירותיהם מופיעים באתר וכל תוכן ביחס למוצרים ולשירותים נמצאים באחריותם הבלעדית של העסקים כאמור, ועל כן מובן שלאתר אין כל אחריות בגין מידע מעין זה, ואין האתר ערב למידת הדיוק של מידע זה.</p>
                    <p>	•	האתר לא יהיה אחראי לכל נזק(ישיר או עקיף), הפסד, עגמת נפש והוצאות שייגרמו לגולשים ו / או לצדדים שלישיים כלשהם בעקבות שימוש או הסתמכות על כל תוכן, מידע, נתון, מצג, תמונה, וידאו, אודיו, פרסומת, מוצר, שירות וכו' המופעים באתר. כל הסתמכות כאמור נעשית על-פי שיקול דעתו ואחריותו הבלעדית של הגולש באתר.</p>
                    <p>	•	האתר בשום מקרה לא יהיה אחראי לנזק שנגרם לגולש האתר באמצעות יצירת קשר עם העסקים המפורסמים באתר ו / או שותפיו העסקיים של האתר ו / או אתרים החיצוניים.</p>
                    <p>	•	האתר ממליץ לגולשים באתר לנהוג כצרכנים נבונים וזהירים, ולקרוא בעיון את המידע המוצג באתר ובכלל זה את המידע ביחס למוצר ו / או השירות עצמו, תיאורו והתאמתו, כמתואר באתר.</p>
                    <p>	•	התכנים המופיעים באתר ניתנים ומסופקים לשם העשרה בלבד וכל פעולה שתעשה בעקבותיהם תעשה באחריות המשתמש.כל פעולה שתעשה בעקבות שימוש בתכנים באתר תעשה במשנה זהירות וכי האחריות הבלעדית לכל נזק(חלילה ויקרה), מכל סוג שהוא, תהיה על המשתמש.</p>
                    <p>	•	התכנים באתר ניתנים לשימוש כמות שהם("AS IS").לא ניתן להתאימם לצרכיו של כל אדם ואדם.לא תהיה לגולש כל טענה, תביעה או דרישה כלפי האתר בגין תכונות של התכנים, יכולותיהם, מגבלותיהם ו / או התאמתם לצרכיו.</p>
                    <p>	•	האתר בכללותו, לרבות כל המידע המופיע בו, מוצע לציבור כמות שהוא, ויהיה מדויק ונכון ככל הניתן, ואולם, יתכן והמידע אינו שלם או לחלופין, יתכן ונפלו טעויות טכניות או אחרות במידע.</p>
                    <p>	•	השימוש באתר ייעשה על אחריותו הבלעדית והמלאה של כל גולש.כל החלטה שתתקבל ביחס לתכנים שיתפרסמו באתר הינה באחריותו המלאה.  </p>
                    <p>	•	השימוש באתר:</p>
                    <p>	•	השימוש באתר מותר למטרות פרטיות ואישיות בלבד.אין להעתיק ולהשתמש או לאפשר לאחרים להשתמש, בכל דרך אחרת בתכנים מתוך האתר, לרבות באתרי אינטרנט אחרים, בפרסומים אלקטרוניים, בפרסומי דפוס וכיו"ב, לכל מטרה, בין מסחרית ובין שאינה מסחרית, שאיננה לצורך שימוש אישי ופרטי, למעט בכפוף לקבלת אישור ו/או הסכמה מפורשת מראש ובכתב.</p>
                    <p>	•	אין להפעיל או לאפשר להפעיל כל יישום מחשב או כל אמצעי אחר, לרבות תוכנות מסוג  Crawlers Robots  וכדומה, לשם חיפוש, סריקה, העתקה או אחזור אוטומטי של תכנים מתוך האתר.בכלל זה, אין ליצור ואין להשתמש באמצעים כאמור לשם יצירת לקט, אוסף או מאגר שיכילו תכנים מהאתר.</p>
                    <p>	•	אין להציג תכנים מהאתר בכל דרך שהיא ובכלל זה באמצעות כל תוכנה, מכשיר, אביזר או פרוטוקול תקשורת המשנים את עיצובם באתר או מחסירים מהם תכנים כלשהם ובפרט פרסומות ותכנים מסחריים.</p>
                    <p>	•	אין לקשר לאתר מכל אתר המכיל תכנים פורנוגראפיים, תכנים המעודדים לגזענות או להפליה פסולה, או המנוגדים לחוק, או שפרסומם מנוגד לחוק או המעודדים פעילות המנוגדת לחוק.</p>
                    <p>	•	אין לקשר לתכנים מהאתר, שאינם דף הבית של האתרים("קישור עמוק") ואין להציג, או לפרסם תכנים כאמור בכל דרך אחרת, אלא אם הקישור העמוק יהיה לדף אינטרנט באתר במלואו וכפי שהוא("AS IS") כך שניתן יהיה לצפות ולהשתמש בו באופן הזהה לחלוטין לשימוש ולצפייה בו באתר.במסגרת זו, חל איסור לקשר לתכנים מהאתר, במנותק מדפי האינטרנט שבהם הם מופיעים באתרים(לדוגמה: אסור לקשר במישרין לתמונה או לקובץ גרפי באתר, אלא לעמוד המלא שבו הם מופיעים).כמו כן על כתובתו המדויקת של דף האינטרנט באתר להופיע במקום הרגיל המיועד לכך בממשק המשתמש, לדוגמה: בשורת הכתובת(Status Bar"") בדפדפן של המשתמש.אין לשנות, לסלף או להסתיר כתובת זו ואין להחליפה בכל כתובת אחרת;</p>
                    <p>	•	האתר רשאי לדרוש ביטול כל קישור עמוק כאמור לפי שיקול דעתו הבלעדי ובמקרה זה לא תעמוד כל טענה, דרישה או תביעה כלפי האתר בעניין זה.</p>
                    <p>	•	האתר לא יישא בכל אחריות לכל נזק שייגרם כתוצאה מכל קישור לתכנים מהאתר ומכל הצגה או פרסום של תכנים כאמור בכל דרך אחרת.האחריות המלאה והבלעדית לכל קישור, הצגה או פרסום של התכנים, היא על מבצע הקישור בלבד.</p>
                    <p>	•	על הגולש לשפות את האתר, עובדיו, מנהליו, שותפיו העסקיים או מי מטעמו בגין כל נזק, הפסד, אבדן רווח, תשלום או הוצאה שייגרמו להם - ובכלל זה שכ"ט עו"ד והוצאות משפט עקב הפרת תקנון זה.בנוסף, ישפה המשתמש את האתר, עובדיו, מנהליו או מי מטעמו בגין כל טענה, תביעה ו / או דרישה שתועלה נגדם על ידי צד שלישי כלשהו כתוצאה מתכנים שנמסרו על ידו לפרסום באתר וכתוצאה מקישורים שביצע לאתר.</p>
                    <p>	•	שינויים באתר, תקלות והפסקות שירות:</p>
                    <p>	•	מבלי לגרוע מהאמור לעיל, האתר יוכל לשנות מעת לעת את מבנה האתר, ו / או המראה ו / או העיצוב של האתר, את היקפם וזמינותם של השירותים ו / או המוצרים באתר, יהיה רשאי לגבות תשלום בעד תכנים, שירותים ומוצרים כאלה או אחרים על פי החלטתו.כמו כן, האתר יהיה רשאי לשנות כל היבט אחר הכרוך באתר והכל, בלא צורך להודיע על כך מראש.</p>
                    <p>	•	שינויים כאמור יבוצעו, בין השאר, בהתחשב באופי הדינאמי של רשת האינטרנט ובשינויים הטכנולוגיים והאחרים המתרחשים בה.מטבעם, שינויים מסוג זה עלולים להיות כרוכים בתקלות ו / או לעורר בתחילה אי נוחות וכיו"ב. לא תהיה לגולשים באתר כל טענה, תביעה ו/או דרישה כלפי האתר בגין ביצוע שינויים כאמור ו/או תקלות שיתרחשו אגב ביצועם.</p>
                    <p>	•	האתר אינו מתחייב ששירותי האתר לא יופרעו, יינתנו כסדרם או בלא הפסקות, יתקיימו בבטחה וללא טעויות ויהיו חסינים מפני גישה בלתי מורשית למחשבי האתר או מפני נזקים, קלקולים, תקלות או כשלים - והכל, בחומרה, בתוכנה, בקווי ובמערכות תקשורת אצל האתר או אצל מי מספקיו.</p>
                    <p>	•	קניין רוחני:</p>
                    <p>	•	כל זכויות היוצרים והקניין הרוחני הם בבעלות האתר בלבד, או בבעלות צד שלישי, שהרשה לאתר לעשות שימוש על פי דין בתכנים אלו ובכלל זה שותפיה העסקיים של האתר.</p>
                    <p>	•	אין להעתיק, להפיץ, להציג בפומבי, לבצע בפומבי, להעביר לציבור, לשנות, לעבד, ליצור יצירות נגזרות, למכור או להשכיר כל חלק מן הנ"ל, בין ישירות ובין באמצעות או בשיתוף צד שלישי, בכל דרך או אמצעי בין אם אלקטרוניים, מכאניים, אופטיים, אמצעי צילום או הקלטה, או בכל אמצעי ודרך אחרת, בלא קבלת הסכמה בכתב ומראש מהאתר או מבעלי הזכויות האחרים, לפי העניין, ובכפוף לתנאי ההסכמה )ככל שתינתן). הוראה זו תקפה גם ביחס לכל עיבוד, עריכה או תרגום שנעשו על ידי האתר לתכנים שהוזנו או נמסרו על ידי הגולשים לאתר.</p>
                    <p>	•	אם וככל שניתנה הסכמה כאמור, יש להימנע מלהסיר, למחוק או לשבש כל הודעה או סימן בעניין זכויות קניין רוחני, לדוגמה: סימון זכויות היוצרים,© או סימן מסחר ®, הנלווים לתכנים שיעשה בהם שימוש.</p>
                    <p>	•	סימני המסחר, צילומים, תמונות תכנים ומודעות הפרסומת של שותפיה העסקיים של האתר הינם קניינם של מפרסמים אלה בלבד.גם בהם אין לעשות בהם שימוש בלא הסכמת המפרסם מראש ובכתב.</p>
                    <p>	•	סמכות שיפוט:</p>
                    <p>	•	על תקנון זה יחולו אך ורק דיני מדינת ישראל, אולם לא תהיה תחולה לכללי ברירת הדין הבינלאומי הקבועים בהם.</p>
                    <p>	•	לבתי המשפט במחוז מרכז תהיה סמכות שיפוט ייחודית בכל עניין הנובע ו / או הקשור לתקנון זה.</p>
                    <p>	•	מדיניות פרטיות:</p>
                    <p>	•	האתר מכבד את פרטיות הלקוחות.</p>
                    <p>	•	על מנת לספק שירות איכותי, אנו עשויים להשתמש בנתונים האישיים שלך, ובין היתר, מידע על השימוש שלך באתר ומידע על המכשיר הנייד שלך  או המחשב("המידע הנאסף באתר").המידע הנאסף באתר עשוי לשמש את האתר לצרכים הבאים:</p>
                    <p>	•	לספק לך שירותים ומוצרים ולשפר את האתר ו / או את השירותים;</p>
                    <p>	•	תפעולו התקין של האתר;</p>
                    <p>	•	לנתח את ולנהל את האתר באופן תקין;</p>
                    <p>	•	שיפור שירות הלקוחות של האתר;</p>
                    <p>	•	ליצירת קשר או לספק לך נתונים בקשר לאתר ו / או לשירות ו / או למוצר.</p>
                    <p>	•	בעת השימוש באתר, האתר עשוי לאסוף מידע מסוים באופן אוטומטי.לדוגמה:</p>
                    <p>	•	כתובת ה - IP שלך, פרוטוקול האינטרנט, ספק האינטרנט או הדפדפן וסוג המכשיר ממנו אתה גולש;</p>
                    <p>	•	הקלטת הפעילות שלך באתר או תרשים העמודים בהם ביקרת;</p>
                    <p>	•	שימוש בעוגיות על מנת לזהות את המכשיר ממנו אתה גולש.קובץ עוגיות הם קובץ טקסט קטן שאתר, יישום מקוון או דואר אלקטרוני עשויים לשמור בדפדפן האינטרנט ו / או בכונן הקשיח של המחשב לשימוש בביקורים הבאים באתר; </p>
                    <p>	•	מידע שתזין, תשתף או שניתן להשיג מהשימוש שלך באתר.</p>
                    <p>	•	אנו עשויים לשתף את המידע האישי שלך(למעט פרטי אשראי) עם צדדים שלישיים, כולל עם נותני שהשירותים.</p>
                    <p>	•	דוגמאות לפעולות שנותני שירותים ו / או מוצרים עשויים לבצע הכרוכים במידע שלך:</p>
                    <p>	•	לספק לך את השירותים;</p>
                    <p>	•	לפתח ולתחזק את האתר;</p>
                    <p>	•	לצבור מידע על לקוחות ו / או גולשים ולשפר את שירות הלקוחות.לאחר מכן, האתר עשוי לשתף מידע כאמור עם שותפי שיווק פוטנציאליים ומפרסמים;</p>
                    <p>	•	שיתוף רשתות חברתיות כגון פייסבוק, אינסטגרם ואחרות ומפרסמים נוספים ברשת כגון גוגל, טאבולה ואחרים;</p>
                    <p>	•	לצרכים סטטיסטים – אנו מספקים מידע אישי לגופים וחברות שאנו נותנים בהן אמון כדי שיעבדו את המידע עבורנו לפי הוראות האתר ובאופן העולה בקנה אחד עם תקנון זה ומדיניות האתר.ככלל, וככל שלא ניתנה הסכמה מראש למסירת מידע אישי, מידע המועבר לצרכים סטטיסטים אינו כולל פרטים מזהים.</p>
                    <p>	•	במידה והאתר ימוזג לתוך פעילות גוף אחר או אם האתר יעבור לבעלות תאגיד אחר ניתן יהיה להעביר לתאגיד החדש את המידע הקיים באתר, אבל רק במקרה שהתאגיד יתחייב לשמור על תנאי תקנון זה.</p>
                    <p>	•	לנותני שירותים ושותפים עסקיים כאמור ניתנת גישה לכל או לחלק מהמידע שלך, והם עשויים להשתמש בעוגיות(כהגדרתן לעיל) או בטכנולוגיית איסוף אחרות.</p>
                    <p>	•	חשוב לזכור שלא ניתן לערוב במאת האחוזים מפני פעילות עוינת ונחושה מצד גורמים זרים ולכן אין בפעולות אלה בטחון מוחלט והאתר לא מתחייב שהשירותים ו / או המוצרים באתר יהיו חסינים באופן מוחלט מפני גישה בלתי מורשית למידע הנאסף בו.</p>
                    <p>	•	צרו קשר:</p>
                    <p>	•	האתר מקפיד על קיום הוראות החוק ומכבד את זכותם של משתמשי האתר ואחרים לפרטיות ולשם טוב.אם אתה סבור כי פורסם באתר תוכן הפוגע בך מטעם כלשהו, נא פנה אלינו לפי הפרטים שלהלן ואנו נשתדל לטפל בפנייתך בכל ההקדם.פניות כאמור ניתן להעביר באמצעים הבאים:</p>
                    <p>כתובת: הפטל 3, הוד השרון;</p>
                    <p>טלפון: 053 - 3724658;</p>
                    <p>דוא"ל: PickNPull99@Gmail.com</p>
                    <p></p>
                    <p>כל הזכויות בתקנון זה שמורות לדניאל עורכי דין ואין להעתיק, לשכפל או להפיץ אותו.</p>
                    <p>עדכון אחרון: מרץ 2021</p>
                </div> :
                <div className="container">
                    <p>Bylaws, Terms of Use and Privacy Policy for the "Pick N Pull" website</p>
                    <p>Pick N Pull welcomes your choice to browse the website operated by it at: www.Pick - N - Pull.co.il("the Website").</p>
                    <p> The site provides an internet platform for the site's clientele to order and purchase convenient and safe transportation services for any purpose, including events, festivals and the chair ("services") from the best drivers and shuttle professionals ("service providers"). Information on how to use the site services, costs and more ("the products") can also be found on the site.</p>
                    <p>general:</p>
                    <p>	• Site browsing is subject to the terms of these Terms and Conditions of Use(the "Bylaws").Please read the by - laws carefully, as browsing the site and performing actions indicate your agreement to the terms contained in the by - laws.The Website also reserves the right to change the terms of the By - Laws, from time to time, at its sole discretion and without notice.The date of such change shall be from the time of its publication on the Website.</p>
                    <p>	• The provisions of this By - Law apply equally to both sexes and the use of male or female language is for convenience only.</p>
                    <p>	• The terms of the by - law apply to the use of the site and the content contained therein by any computer or other communication device(such as a mobile phone, tablet computers and the like).They also apply to the use of the Website, either through the Internet or through any other network or media.</p>
                    <p>	• Site browsing is allowed at any age.The site purchase is for legal qualifications from the age of 18 only.The purchase of a minor under the age of 18 requires the approval of a parent or guardian.</p>
                    <p> 	• In the event that it is determined that a provision of these By - Laws is unenforceable or invalid on any behalf, it shall not affect or impair the legality, validity and enforcement of the other by - laws.</p>
                    <p>	• Site browsing:</p>
                    <p>	• Browsing the site and looking for it do not require registration, and is open to any user.However, there are actions that require registration and identification, as detailed above.</p>
                    <p>  	• When registering and / or purchasing a site, the user will be asked to provide personal information such as: first name, last name, address, telephone as well as an active e - mail address(at the discretion of the site).Delivering partial or incorrect details may prevent the possibility of using the service and thwart contact if necessary.In case of change of details, they must be updated on the site.</p>
                    <p>	• It is clarified that there is no obligation by law to provide the information, but without its morality it will not be possible to purchase the site or use the site services.</p>
                    <p>	• The Website will not make any details provided, except in accordance with the site's privacy policy which is an integral part of these By-Laws.</p>
                    <p>	• Leaving details and / or purchase on the site, subject to the user's consent, includes, inter alia, obtaining marketing content, information regarding promotions, updates and discounts offered to registered users.</p>
                    <p> 	• The Website may periodically determine ways of identifying the site, including connecting to the site through Facebook and / or Google and / or other social network and / or other platform.</p>
                    <p>	• The site may prevent any user from using the site at his absolute discretion.Without detracting from the above, the site may block its access to it in any of the following cases:</p>
                    <p>	• If you leave details and / or purchase on the site, incorrect details were intentionally provided;</p>
                    <p>	• In the event that a site is used to carry out or to try to commit an unlawful act under the law of the State of Israel, or an act which is envisaged as illegal, or to allow, facilitate, assist or encourage the execution of such an act;</p>
                    <p>	• If the terms of these bylaws are violated;</p>
                    <p>	• In case the site is used in an attempt to compete with the site;</p>
                    <p>	• If done by browsing any action that would prevent others from browsing and using the site in any way.</p>
                    <p>	• Services offered for purchase on site:</p>
                    <p>	• The proposed site services for purchase will appear on the site pages.</p>
                    <p>	• The site is not required, in any way, to maintain any range of services.</p>
                    <p>	• The Website may at any time change the range of services offered for purchase on the Website, replace them to downplay them, add to them, without any notice or prior notice.</p>
                    <p>	• The manner in which the services are presented on the site is at the sole discretion of the site, and the service providers will have no claim in this regard.</p>
                    <p>	• The purchase on the site is for private customers only for non - commercial use, for purchase for such commercial use, the site must be contacted according to the details provided below.</p>
                    <p>	• Website purchase:</p>
                    <p>	• Services listed on the site can be purchased conveniently and securely through the site.</p>
                    <p> 	• Website services will be purchased through payment for the service through the site.</p>
                    <p> 	• When ordering a service on the site, the site will check the availability of the service booked with the service providers, and after receiving the service, the service will be charged for the service provided.</p>
                    <p>	• Upon order confirmation, Mail will send an order confirmation to the customer with the order details.</p>
                    <p>	• If a service provider is not found available for service delivery, the site will notify the customer and the customer will not be charged.</p>
                    <p> 	• The prices listed on the site services are the latest prices.</p>
                    <p>	• In addition to the provisions of the bylaws, the contract with the service provider will also apply to the provisions of the bylaws and the policy of the service provider.</p>
                    <p>	• Notwithstanding the foregoing, the Website reserves the right to establish other payment arrangements for customers and registrants and all at its sole discretion.</p>
                    <p>	• Service delivery policy:</p>
                    <p> 	• The site will ensure the provision of the service order made on the site at a time and place where the parties agree when placing the order on the site.</p>
                    <p>	• The Website will not be liable for any delay and / or delay in supply and / or non - supply, resulting from:</p>
                    <p>	• Force majeure and / or events not controlled by the site;</p>
                    <p>	• For reasons related to service providers;</p>
                    <p>	• Closing the economy so that the site's activities and / or service providers and / or its suppliers and / or service providers are impaired, for any reason.</p>
                    <p>	• The customer must update the site and the business from the service provider for any changes to the service order details made on the site as soon as possible.</p>
                    <p>	• Refund, change and cancellation policy:</p>
                    <p> • The site may cancel a transaction and transportation at its discretion to demand a refund to the paying customer </p>
                    <p>	• A request for a refund, change or cancellation of a transaction will be forwarded to the site in one of the means of contracting listed at the bottom of the bylaws.</p>
                    <p> • Change or cancellation of a service order shall be possible within 14 days of the transaction being executed or from the date of receipt of the transaction details(by the later), provided that such cancellation is made at least two days, other than rest days, prior to the date on which the service is provided.</p>
                    <p>	• The refund will be made by the form of payment in which the customer placed the order.</p>
                    <p>	• In the event of cancellation of such commissioned services, a cancellation fee of 5 % of the service amount or NIS 100(according to their lower construction) will be charged.</p>
                    <p>	• The provisions of these By - Laws and Section 6 above are governed by the provisions of the Consumer Protection Act, 1981.</p>
                    <p>	• Site Warranty:</p>
                    <p>	• The information contained on the Website should not be considered as a promise of any outcome and / or responsibility for the activities of the services provided therein or by the service providers.The Website shall not be liable for any damage, direct or indirect, which may be caused by reliance on information contained on the Website and / or links to other Sites and / or any other internal and / or external information source and / or use of the products and / or services presented by it. .</p>
                    <p>	• Site warranty for service is limited to service value.The total liability of the site with respect to each service shall in no case exceed the purchase price of that service.</p>
                    <p>	• Website customers acknowledge and declare that they will be held responsible for contacting and requiring service providers compensation for any damage, direct or indirect, which will result in the use of the Service.</p>
                    <p> 	• The services pictures on the site are shown for illustrative purposes only.There may be differences in appearance, hue, size, and the chair between the product and the service, as shown on the site, and the product and service provided to the customer.A super mistake in describing a product and service and its price will not charge the site.</p>
                    <p>	• Information and representations about products and services displayed on the Website, originating from businesses whose products and / or services appear on the Website and any content in relation to the Products and Services is the sole responsibility of such businesses, and it is therefore understandable that the Website has no responsibility for such information, and the Website does not guarantee the accuracy of such information.</p>
                    <p>	• The Website will not be liable for any damage(direct or indirect), loss, grief and expenses incurred by any surfers and / or third parties following the use or reliance on any content, information, given, presentation, image, video, audio, advertisement, product, service and so 'The shows on the site. Any such reliance is made at the discretion and sole responsibility of the user on the site.</p>
                    <p>	• The site will in no case be liable for any damage caused to the site user by contacting the site's advertised businesses and / or the site's business partners and / or external sites.</p>
                    <p>	• The site recommends that site users act as prudent and cautious consumers, and carefully read the information presented on the site, including the information regarding the product and / or service itself, its description and suitability, as described on the site.</p>
                    <p>	• The content appearing on the site is provided and provided for enrichment only and any action that follows them will be the responsibility of the user.Any action you take following the use of the content of the Website will be of caution and that the sole responsibility for any damage(God forbid), of any kind, will be on the user.</p>
                    <p>	• The content on the site can be used as is ("AS IS").The needs of every person cannot be matched.No claim, claim or demand will be made against the Website for any features of the Content, their capabilities, their limitations and / or their suitability for its needs.</p>
                    <p>	• The site as a whole, including all information contained therein, is offered to the public as is, and will be as accurate and correct as possible, however, the information may not be complete or alternatively, technical or other errors may have occurred in the information.</p>
                    <p>	• Use of the Website will be at the sole and full responsibility of each surfer.Any decision made regarding the content posted on the site is the full responsibility.</p>
                    <p>  	• Use of the site:</p>
                    <p>	• Use of the site is permitted for private and personal purposes only.Do not copy and use or allow others to use, in any other way, content from within the Website, including other websites, electronic publications, print publications and chair, for any purpose, whether commercial or non - commercial, which is not for personal and private use, except subject to approval and / Or express written consent.</p>
                    <p>	• Do not enable or enable any computer application or any other means, including Crawlers Robots software and the like, for search, scan, copy or automatic retrieval of content from the site.In all of this, such means should not be created and used to create a collection, collection or repository that will contain content from the site.</p>
                    <p>	• Content may not be displayed from the Website in any way, including any software, device, accessory or communication protocol that changes their design on the Website or removes any content and in particular commercials and content.</p>
                    <p>	• Do not link to a site that contains pornographic content, content that encourages racism or wrongful discrimination, or is contrary to the law, or whose publication is contrary to the law or encourages activity that is contrary to the law.</p>
                    <p>	• Do not link content from the site, which is not the site's homepage ("deep link") and should not be displayed, or published as otherwise, unless the deep link is to a full web page and as it is ("AS IS") so that it can be viewed and used. Completely identical to using and viewing the site.In this context, it is prohibited to link content from the site, disconnected from the web pages in which they appear on the sites (for example: it is not allowed to directly link to an image or graphic file on the site, but to the full page in which they appear).Also, the exact address of the web page on the site must appear in the usual place designated for this in the user interface, for example: in the address bar (Status Bar") in the user's browser.Do not change, leak or hide this address and should not be replaced by any other address;</p>
                    <p>	• The Website may require the cancellation of any such deep link at its sole discretion and in this case shall not comply with any claim, demand or claim against the Website in this regard.</p>
                    <p>	• The Website shall not be liable for any damage caused by any link to the Content from the Website and any presentation or publication of such Content in any other way.The full and exclusive responsibility for any link, display or publication of the content is for the link operation only.</p>
                    <p>	• The surfer must indemnify the site, its employees, managers, business partners or anyone on his behalf for any damage, loss, loss of profit, payment or expense incurred by them - including attorney's fees and legal expenses due to violation of these bylaws.In addition, the user will indemnify the site, its employees, managers or anyone on his behalf for any claim, claim and / or requirement raised against them by any third party as a result of the content provided by him for publication on the site as a result of links he has made to the site.</p>
                    <p>	• Site changes, faults and service breaks:</p>
                    <p>	• Mb</p>
                </div>}
        </InnerPageHolder>
    </div>
}