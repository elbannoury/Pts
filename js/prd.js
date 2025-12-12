// بيانات المنتجات الكاملة مع خيارات التخصيص المحدثة
const productsData = [
        {
        id: 1,
        name: "BMW M4 GT3",
        description: "لوحة فنية راقية تُجسّد سيارة السباق الأسطورية BMW M4 GT3 في مشهد أمامي مفعم بالحركة والطاقة. تتميز بطباعة عالية الجودة وإطار أنيق يعكس تفاصيل دقيقة وألوان زاهية. مثالية لعشاق السيارات والسباقات، ولإضافة لمسة عصرية فاخرة إلى المنازل أو المكاتب أو المساحات التجارية."  
,
        price: 429,
        images: [
            "images/bmw/20251113_105539_4.jpg",
            "images/bmw/1762981416589.png",
            "images/bmw/1762981436881.png",
            "images/bmw/1762981479109.png",
            "images/cdr/all3.png"
        ],
        tag: "الأكثر مبيعاً",
        category: "BMW",
        details: "هذه اللوحة الفنية تم رسمها بدقة عالية باستخدام ألوان زيتية على قماش فني عالي الجودة. تبرز اللوحة التفاصيل الدقيقة للسيارة من خلال استخدام الظلال والإضاءة المحترفة. الإطار الخشبي المصنوع يدوياً يضيف لمسة أنيقة وجمالية للعمل الفني.",
        specifications: [
            { name: "المادة", value: "   vn / fx / اختياري " },
            { name: "الحجم", value: "75 × 40 سم" },
            { name: "الإطار", value: "بدون / مخصص " },
            { name: "الوزن", value: "200~1300غ" },
            { name: "الوقت المتوقع للتوصيل", value: "2-7 أيام عمل" },
            { name: "الضمان", value: "سنة" }
        ],
        // إضافة خيارات التخصيص
        sizes: [
            { id: "s1", name: "متوسط (90×50 سم)", price: 100 },
            { id: "s2", name: "كبير (120×65 سم)", price: 200 }
        ],
        frames: [
            { 
           id: "f1", 
           name: "بدون إطار", 
           price: 0
            },
            { 
           id: "f2", 
           name: "إطار خشبي", 
           price: 90,
           thumbnail: "images/c/wood.jpeg"
            },
            { 
          id: "f3", 
          name: "إطار المنيوم ", 
          price: 180,
          thumbnail: "images/c/alm.jpeg"
            }
        ],
        addons: [
  { id: "a1", name: "توقيع البراند", price: 0, selected: false },
  { id: "a2", name: "شهادة أصالة", price: 50, selected: false },
  { id: "a3", name: "تغليف فاخر / مخصص", price: 150, selected: false }
]
}, 
    {
        id: 2,
        name: "Panda | The Wise Gaze",
        description: "🎨 نظرة الحكيم لوحة فنية مميزة تجمع بين الهدوء والقوة في نظرة باندا متأمل، بخلفية برتقالية نابضة بالحياة وإطار ذهبي فاخر. تضيف لمسة من الإلهام والجمال لأي مساحة — مثالية للمكاتب، غرف المعيشة، أو محبي الفن العصري.",
        price: 549,
        images: [
            "images/some/20251011_004904_3.jpg",
            "images/some/1762939056813.png",
            "images/some/1762939062106.png",
            "images/some/1762939075086.png",
            "images/some/1762952133402.png",
            "images/some/1762952216495.png",
            "images/cdr/all3.png"
          
        ],
        category: "CARTOON",
        details: "panda",
        specifications: [
            { name: "المادة", value: "   vn / fx / اختياري " },
            { name: "الحجم", value: "70 × 50 سم / اختياري" },
            { name: "الإطار", value: "إختياري / بدون " },
            { name: "الوزن", value: "400~2.3 غ~كغ" },
            { name: "الوقت المتوقع للتوصيل", value: "2-4 أيام عمل" },
            
        ],
        // إضافة خيارات التخصيص
        sizes: [
            { id: "s1", name: "صغير (50×40 سم)", price: 0 },
            { id: "s2", name: "متوسط (70×50 سم)", price: 50 },
            { id: "s3", name: "كبير (120×90 سم)", price: 150 }
        ],
        frames: [
            { 
                id: "f1", 
                name: "بدون إطار", 
                price: 0,
                thumbnail: "images/frames/no-frame.jpg"
            },
            { 
                id: "f2", 
                name: "إطار خشبي", 
                price: 80,
                thumbnail: "images/c/wood.jpeg"
            },
            { 
                id: "f3", 
                name: "إطار ألمنيوم ذهبي", 
                price: 150,
                thumbnail: "images/c/alm.jpeg"
            }
        ],
        addons: [
            { id: "a1", name: "توقيع البراند", price: 20, selected: false },
            { id: "a2", name: "شهادة أصالة", price: 49, selected: false },
            { id: "a3", name: "تغليف فاخر / مخصص", price: 120, selected: false }
        ]
    },
    {
        id: 3,
        name: "WANTED | مطلوب ",
        description: "🖼️ لوحة WANTED الكلاسيكية المميزة – قابلة للتخصيص بالكامل أضف لمسة فنية جريئة إلى ديكور منزلك أو مكتبك مع لوحة WANTED المرآتية المستوحاة من أسلوب الغرب الأمريكي القديم 🤠. تجمع هذه القطعة بين الأناقة والمرح، حيث يمكنك تخصيصها باسمك أو اسم أي شخصية تختارها 💫، مع إمكانية تحديد قيمة المكافأة حسب رغبتك 💰. 🪞 يمكن أن تكون اللوحة مرآة عاكسة تضيف عمقاً للمكان ✨، أو صورة مطبوعة بجودة عالية لإطلالة أكثر فنية.",
        price: 349,
        images: [
            "images/wnt/20251113_132609_5.jpg",
            "images/wnt/1763028681911.jpg",
            "images/wnt/1763028160175.jpg",
            "images/wnt/1763028542652.png"
            ,
            "images/wnt/1763028917109.jpg",
            "images/cdr/all3.png"
        ],
        tag: "جديد",
        category: "mirror",
        details: "خصصها كما تريد ",
        specifications: [
            { name: "المادة", value: "   vinyls / 2×frx " },
            { name: "الحجم", value: "85 × 60 سم" },
            { name: "الإطار", value:  "بدون / مخصص"},
            { name: "الوزن", value: " 400~1200غ" },
            { name: "الوقت المتوقع للتوصيل", value: "3-5 أيام عمل" },
            { name: "الضمان", value: " سنة" }
        ],
        // إضافة خيارات التخصيص
        sizes: [
            { id: "s1", name: "صغير ( 42×30سم)", price: 0 },
            { id: "s2", name: "متوسط (80×112 سم)", price: 200 }
        ],
        frames: [
            { 
                id: "f1", 
                name: "بدون إطار", 
                price: 0,
                thumbnail: "images/frames/no-frame.jpg"
            },
            { 
                id: "f2", 
                name: "إطار خشبب", 
                price: 60,
                thumbnail: "images/c/wood.jpeg"
            },
            { 
                id: "f3", 
                name: "إطار المنيوم ذهبي", 
                price: 150,
                thumbnail: "images/c/alm.jpeg"
            }
        ],
        addons: [
            { id: "a1", name: "توقيع البراند", price: 0, selected: false },
            { id: "a2", name: "شهادة أصالة", price: 50, selected: false },
            { id: "a3", name: " / مخصص تغليف فاخر", price: 150, selected: false }
        ]
    },
    {
        id: 4,
        name: " SIMPSON × AUDI",
        description: "الاستثناء لي بغا الحـــــــــال🥶🔥 لوحة فنية مذهلة تجمع بين عالم The Simpsons المحبوب وأناقة سيارة AUDI RS6 في تصميم واحد يخطف الأنظار. نقدمها لك مطبوعة بجودة عالية ودقة متناهية، مع اهتمامٍ كبير بالتفاصيل لتصل إليك كقطعة فنية تستحق الاقتناء. هذه اللوحة مصممة بحب، وموجهة للأطفال لما فيها من طابع مرح وكرتوني، ومخصّصة أيضًا للكبار بلمستها الفاخرة وإمكانية تخصيص لوحة ترقيم السيارة كما ترغب، مما يجعلها قطعة شخصية وحصرية تعكس ذوقك وتميزك.  اختيار مثالي لتزيين غرف الأطفال، مكاتب العمل، الصالات أو كهدية فريدة تبقى في الذاكرة.🎨✨",
        price: 310,
        images: [
            "images/crtn/simpson/1763066019621.jpg",
            "images/crtn/simpson/1763070267962.jpg",
            "images/crtn/simpson/1763070295988.jpg",
            "images/crtn/simpson/1763070330332.jpg",
            "images/crtn/simpson/1763070452718.jpg",
            "images/cdr/all3.png"
        ],
        category: "CARTOON",
        details: "simpsaudi",
        specifications: [
            { name: "المادة", value: "   vn / fx / اختياري " },
            { name: "الحجم", value: "70 × 50 سم" },
            { name: "الإطار", value: "بدون / اختياري " },
            { name: "الوزن", value: "300~1200غ" },
            { name: "الوقت المتوقع للتوصيل", value: "2-4 أيام عمل" }
        ],
        // إضافة خيارات التخصيص
        sizes: [
            { id: "s1", name: "متوسط (80×60 سم)", price: 0 },
            { id: "s2", name: "كبير (120×90 سم)", price: 200 }
        ],
        frames: [
            { 
                id: "f1", 
                name: "بدون إطار", 
                price: 0
            },
            { 
                id: "f2", 
                name: "إطار خشبي", 
                price: 80,
                thumbnail: "images/c/wood.jpeg"
            },
            { 
                id: "f3", 
                name: "إطار المنيوم ذهبي", 
                price: 150,
                thumbnail: "images/c/alm.jpeg"
            }
        ],
        addons: [
            { id: "a1", name: "توقيع البراند", price: 0, selected: false },
            { id: "a2", name: "شهادة أصالة", price: 50, selected: false },
            { id: "a3", name: "تغليف فاخر / مخصص", price: 150, selected: false }
        ]
    },
    {
        id: 5,
        name: "Maybach SL680",
        description: "أضف لمسة من الفخامة الهادئة إلى مساحتك مع هذه اللوحة التي تعرض مقدمة سيارة Maybach بلمسات ذهبية راقية. تصميم يجمع بين الأناقة والقوة، ليمنح المكان حضورًا مختلفًا ويجعل الجدار نقطة جذب مميزة. لوحة تضفي شعورًا بالترف وتكمل أي ديكور عصري بكل نعومة وانسجام.",
        price: 495,
        images: [
            "images/crs/mrcds/20251114_022024_7.jpg",
            "images/crs/mrcds/1762784949945.png",
            "images/crs/mrcds/1762784957175.png",
            "images/crs/mrcds/1762784963082.png",
            "images/cdr/all3.png"
        ],
        tag: "حصري",
        category: "MERCEDES",
        details: "special maybach",
        specifications: [
            { name: "المادة", value: "vn/fx / اختياري" },
            { name: "الحجم", value: "80 × 60 سم" },
            { name: "الإطار", value: " بدون / اختياري" },
            { name: "الوزن", value: "200 ~ 1200 غ" },
            { name: "الوقت المتوقع للتوصيل", value: "2-4 أيام عمل" },
            { name: "الضمان", value: " سنة" }
        ],
        // إضافة خيارات التخصيص
        sizes: [
            { id: "s1", name: "صغير (60×40 سم)", price: 0 },
            { id: "s2", name: "متوسط (95 ×75 سم)", price: 150 },
            { id: "s3", name: "كبير (120×90 سم)", price: 200 }
        ],
        frames: [
            { 
                id: "f1", 
                name: "بدون إطار", 
                price: 0
            },
            { 
                id: "f2", 
                name: "إطار خشبي", 
                price: 80,
                thumbnail: "images/c/wood.jpeg"
            },
            { 
                id: "f3", 
                name: "إطار المنيوم ذهبي", 
                price: 160,
                thumbnail: "images/c/alm.jpeg"
            }
        ],
        addons: [
            { id: "a1", name: "توقيع البراند", price: 0, selected: false },
            { id: "a2", name: "شهادة أصالة", price: 50, selected: false },
            { id: "a3", name: "تغليف فاخر", price: 180, selected: false }
        ]
    },
    {
        id: 6,
        name: "BMW M4 Competition",
        description: `لوحة فنية لسيارة BMW M4 Competition المكشوفة – دقة الأداء وأناقة الشغف

حوّل مساحتك إلى تعبير جريء عن السرعة، الأسلوب، والرقي مع هذه اللوحة الفنية المذهلة لسيارة BMW M4 Competition المكشوفة. تم التقاطها بأدق التفاصيل، لتجسد روعة الهندسة الألمانية حيث يلتقي الفخامة بالإثارة.
🔥 لماذا ستقع في حبها:
- تأثير عاطفي قوي: عِش إحساس القيادة المكشوفة كل مرة تدخل فيها الغرفة.
- تصميم فائق: تُبرز الخطوط الأيقونية للـ M4، والعجلات السوداء، والكالبرز الحمراء بوضوح مذهل.
- تشطيب فاخر: مطبوعة على خامات عالية الجودة مع إطار أنيق يناسب الديكورات العصرية.
- محط أنظار الجميع: مثالية لعشاق السيارات، الجامعين، أو كل من يقدّر جمال الأداء العالي.
- مرونة في العرض: مناسبة لصالات العرض، المكاتب، غرف المعيشة، أو الكراجات الفاخرة.

💎 امتلك اللحظة
ليست مجرد سيارة—إنها أسلوب حياة. تمثل BMW M4 Competition القوة، الدقة، والهيبة. دع هذه اللوحة تعكس شغفك بالكمال، وارتقِ بمحيطك بلمسة من أناقة السباقات.

🛒 أضفها إلى سلة التسوق الآن – لأن الذوق الحقيقي يستحق أن يُعرض على جدرانك.`,
        price: 365,
        images: [
            "images/crs/bmw/20251122_102533_9.jpg",
            "images/crs/bmw/1763543805339.jpg",
            "images/crs/bmw/1763543809832.jpg",
            "images/crs/bmw/1763543814120.jpg",
            "images/crs/bmw/1763543818117.jpg",
            "images/cdr/all3.png"
        ],
        category: "BMW",
        details: "M4 مكشوفة ",
        specifications: [
            { name: "المادة", value: "   فوركس / قماش / اختياري " },
            { name: "الحجم", value: "70 × 30 سم" },
            { name: "الإطار", value: "أحمر جذاب" },
            { name: "الوزن", value: "200~1300غ" },
            { name: "الوقت المتوقع للتوصيل", value: "2-7 أيام عمل" },
            { name: "الضمان", value: "سنة" }
        ],
        // إضافة خيارات التخصيص
        sizes: [
            { id: "s1", name: "متوسط (90×38.5 سم)", price: 150 },
            { id: "s2", name: "كبير (120×51 سم)", price: 250 }
        ],
        frames: [
            { 
           id: "f1", 
           name: "بدون إطار", 
           price: 0
            },
            { 
           id: "f2", 
           name: "إطار خشبي", 
           price: 90,
           thumbnail: "images/c/wood.jpeg"
            },
            { 
          id: "f3", 
          name: "إطار المنيوم ", 
          price: 180,
          thumbnail: "images/c/alm.jpeg"
            }
        ],
        addons: [
  { id: "a1", name: "توقيع البراند", price: 0, selected: false },
  { id: "a2", name: "شهادة أصالة", price: 50, selected: false },
  { id: "a3", name: "تغليف فاخر / مخصص", price: 150, selected: false }
]
}, 
       {
        id: 7,
        name: " Aurum Gear Clock",
        description: "أضف لمسة فاخرة إلى جدارك مع Aurum Gear Clock، ساعة حائط بتصميم معدني راقٍ يجمع بين العصرية وقوة التفاصيل الميكانيكية. تتميز الساعة بإطار ذهبي لامع وتروس داخلية زخرفية تمنحها مظهرًا هندسيًا مبهرًا يشدّ الانتباه في أي مساحة. تم تصنيعها من خامات عالية الجودة تضمن المتانة والصلابة، بينما تعمل عقاربها بسلاسة وهدوء تام دون أي ضجيج، مما يجعلها مثالية لغرفة الجلوس، المكتب، صالة الاستقبال، أو المنازل الفخمة.   مميزات Aυɾυɱ Gҽαɾ Cʅσƈƙ: ✔ تصميم ذهبي راقٍ يجمع بين الفن والهندسة ✔ تروس داخلية تمنح طابعًا ميكانيكيًا فاخرًا ✔ مواد قوية وجودة تصنيع ممتازة ✔ تعمل بصوت صامت بالكامل ✔ تناسب الديكورات المودرن والراقية ✔ قطعة ديكور مثالية لإضافة الفخامة لأي جدار حوّل مساحتك إلى لوحة من الأناقة مع  Aυɾυɱ Gҽαɾ Cʅσƈƙ – ساعة ليست للوقت فقط، بل للذوق الراقي.",
        price: 650,
        images: [
            "clock/1764859928550.png",
            "clock/1764859935978.png",
            "clock/1764859944888.png",
            "clock/1764859953668.png"
        ],
        tag: "جديد",
        category: "clock",
        details: "Aυɾυɱ Gҽαɾ Cʅσƈƙ",
        specifications: [
            { name: "الحجم", value: "70 × 70" },
            { name: "العقارب", value: "2" },
            { name: "الوزن", value: "600 ~ 1600 غ" },
            { name: "الوقت المتوقع للتوصيل", value: "2-4 أيام عمل" },
            { name: "الضمان", value: " سنة" }
        ],
        // إضافة خيارات التخصيص
        sizes: [ ""
        ],
        frames: [""
        ],
        addons: [
            { id: "a2", name: "شهادة أصالة", price: 50, selected: false },
            { id: "a3", name: " / هدية تغليف فاخر", price: 280, selected: false }
        ]
    },
  
];
