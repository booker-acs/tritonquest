window.PERSONA_DATA = {
    mundane: [
        {
            title: "The Fine Print",
            icon: "🔍",
            narrative: "You signed a private loan in four minutes and will spend the next ten years reading it. {collegeName} is thrilled to have you, and so is your lender, who has already sent three emails with the subject line 'Great news!'. You owe {debt}. At least you got the signing bonus.",
            conditions: { accepted: true, loanType: 'private' }
        },
        {
            title: "The Procrastinator",
            icon: "⏳",
            narrative: "You chose the loan where the bill arrives later, which is the most you thing you have ever done. {collegeName} will see you in the fall. Your {debt} will see you in four years, slightly larger and wearing a name tag.",
            conditions: { accepted: true, loanType: 'deferred' }
        },
        {
            title: "The Scholar",
            icon: "🎓",
            narrative: "You treated high school like a job, and it paid off. You're heading to {collegeName} with a solid GPA and a slightly concerning caffeine addiction. The next four years will be... well, more of this, but with more debt and better parties (maybe). {tuitionNote}",
            conditions: { gpa: 3.5, accepted: true }
        },
        {
            title: "The Debt-Free",
            icon: "🧾",
            narrative: "You paid for {collegeName} in full, with money you earned, saved, and did not spend on a seventh Pear Pods case. You start college owing nobody anything, with a savings habit that will deeply confuse your roommates.",
            conditions: { accepted: true, paidInFull: true }
        },
        {
            title: "The Borrower",
            icon: "📝",
            narrative: "You got into {collegeName}, and the rest of the money came from a federal loan with a very friendly logo. You owe {debt}. It's a completely normal amount to owe, which is somehow the most unsettling part.",
            conditions: { accepted: true, hasLoan: true }
        },
        {
            title: "The Hustler",
            icon: "💰",
            narrative: "While everyone else was stressing about grades, you were stacking cash. You're leaving high school with a fat wallet and a business plan. You might not have the best grades, but you're already on track to retire by 30. Just remember to come up for air sometimes.",
            conditions: { money: 5000 }
        },
        {
            title: "The Everyman",
            icon: "🙂",
            narrative: "You survived. You didn't make any waves, but you didn't drown either. You finished with average grades, a few friends, and a vague sense of what you want to do next. It's not a glamorous story, but it's yours. And it's just getting started.",
            conditions: { gpa: 2.5, stress: 50, energy: 50 }
        },
        {
            title: "The Wallflower",
            icon: "😶",
            narrative: "You floated through the halls of Triton High like a ghost. You were rarely seen, but you saw everything. You leave with a high GPA but few social connections, preferring the company of books to people. Your future is a blank page you'll write in solitude.",
            conditions: { gpa: 3.7, friendships: 1 }
        },
        {
            title: "The Company Kid",
            icon: "👔",
            narrative: "You were the model employee. Always on time, never complained, and worked more hours than the manager. You have a respectable amount of savings and a glowing recommendation, but you missed out on most of high school. Your future is secure, but you wonder what you missed.",
            conditions: { jobPerformance: 90, money: 2000 }
        }
    ],
    funny: [
        {
            title: "The Burnout",
            icon: "🔥",
            narrative: "You flew too close to the sun, and your wings, made of energy drinks and procrastination, melted. You leave high school with a GPA that looks like a shoe size and a legendary nap-time record. Your parents are 'disappointed,' but mostly just tired. Time for a long, long nap.",
            conditions: { gpa: { max: 1.5 }, stress: 90, energy: 10 }
        },
        {
            title: "The Socialite",
            icon: "🎉",
            narrative: "You were the life of the party, the ruler of the cafeteria, the most popular person in school. Your phone is full of contacts, but your transcript is full of... well, let's not talk about that. You're not sure what's next, but you know you'll have a lot of friends to crash with.",
            conditions: { friendships: 5, gpa: 2.0 }
        },
        {
            title: "The Collector",
            icon: "📦",
            narrative: "You have a lot of stuff. A *lot*. From a VR headset to a possibly-haunted fishing harpoon, your inventory is a museum of questionable financial decisions. You may be broke, but at least your dorm room will be the most interesting fire hazard on campus.",
            conditions: { inventorySize: 10, money: 100 }
        },
        {
            title: "The Delinquent",
            icon: "😈",
            narrative: "You spent more time in detention than in class. You were a master of the prank, a connoisseur of chaos, a friend of Jeffrey. You leave high school with a criminal record (mostly misdemeanors) and a collection of stories you can't tell your parents. Your future is uncertain, but it won't be boring.",
            conditions: { friend_jeff: true, gpa: { max: 1.8 } }
        },
        {
            title: "The Gamer",
            icon: "🎮",
            narrative: "You sacrificed your GPA at the altar of the Game Station X. You have carpal tunnel and a sleep schedule that alarms doctors, but you also have a 10.0 K/D ratio and the respect of strangers on the internet. You're heading to college on a full-ride esports scholarship, much to your parents' confusion.",
            conditions: { has_console: true, gpa: { max: 2.2 }, energy: 20 }
        }
    ],
    surreal: [
        {
            title: "The Cryptid",
            icon: "🕵️",
            narrative: "People aren't entirely sure you actually went to Triton High. You were a blur in the hallways, a whisper in the library, a phantom of the pep rally. You leave with perfect grades and zero social footprint. You've already been recruited by a three-letter agency that doesn't officially exist. Your work is just beginning.",
            conditions: { gpa: 4.0, friendships: 0, stress: 70 }
        },
        {
            title: "The Chosen One",
            icon: "✨",
            narrative: "A squirrel gave you an acorn. Your shadow moves on its own. You've seen things that aren't in the textbooks. You leave high school not with a diploma, but with a destiny. The world is weirder than anyone knows, and you're the one who has to deal with it. Good luck.",
            conditions: { has_acorn: true }
        },
        {
            title: "The Time Traveler",
            icon: "⏳",
            narrative: "You've done this before. Maybe once, maybe a hundred times. You know which teachers give pop quizzes, which investments will fail, and which puddles are deceptively deep. You played high school on 'New Game Plus', and now it's time to see what the next loop brings. Or maybe, just maybe, this is the one where you break the cycle.",
            conditions: { money: 10000, gpa: 4.0, stress: 10 }
        },
        {
            title: "The Void-Stared",
            icon: "👁️",
            narrative: "One day, you stared into the middle distance, and the middle distance stared back. Nothing has been the same since. The textures in the world sometimes fail to load, and you occasionally smell colors. You're leaving high school with a profound and unsettling understanding of reality. You're not sure what's next, but you know it's not on any map.",
            conditions: { stress: 95, energy: 30 }
        },
        {
            title: "The Accidental Tycoon",
            icon: "🤑",
            narrative: "You invested your lunch money in a joke cryptocurrency Jeffrey told you about. You forgot about it for three years. It is now worth more than the GDP of a small country. You are leaving high school as a millionaire with no idea how the stock market works. You've accepted a full-ride to Yale Jr., just for the irony.",
            conditions: { money: 1000000, accepted_yale_jr: true }
        }
    ]
};