# Wolf Girl Training Kit User Manual

## Introduction

-   Allows the owner to use voice commands to control each module of the Wolf Girl Training Kit
    -   The owner can turn on or off the control rights of the lover
    -   Also can designate additional administrators to enable them to use the voice command module
-   With text-based installation process, maintenance mode, and command feedback
-   Provides effective training assistance for issuing tasks and configuring rewards and punishments
    -   Task completion can earn points, which can be exchanged for some "freedom" or EIL services
-   Provides some convenient auxiliary functions
    -   Use of some potions (this function requires the installation of LSCG)
    -   Automatic application of storage and maintenance supplement of the Wolf Girl Training Kit's color scheme
    -   The restraint storage and hidden mode of the Wolf Girl Training Kit

## Deploy the Wolf Girl Training Kit

1. Wear the `Wolf Girl Trainer Multi-Purpose Auxiliary Terminal Mk.II` and the `Wolf Girl Trainer Multi-Purpose Injection Gun Mk.II`
2. Set the `Wolf Girl Trainer Multi-Purpose Injection Gun Mk.II` to the identity chip injection mode
3. Inject the `neck` or `arm` of the person who wants to wear the training kit

-   Can only be deployed to lovers and followers
-   Cannot be deployed to yourself
-   Users who do not have a master-lover relationship can go to EIL or find an EIL individual to wear the kit

4. If you can see the `<info>` information after the injection, it means that the automatic installation has started

## Set permissions

-   "Master" has the highest authority and can close lovers and additional administrator authority
-   "Lover" has authority below the master and can also close the lover's operating authority, but cannot open it
-   "Administrator" authority also has the same level of authority as the lover, but cannot close or open the lover's authority
    -   Specially refers to some sea kings. After closing the lover's operating authority, you can add an administrator to allow the lover to regain control
    -   Wolf girl training kit wearers have partial voice authority
-   "EIL trainer" has the security authority to operate with super control authority in an emergency in order to avoid special conditions
-   "Others" means players who are not in the above user groups do not have most voice authority

## External plugin dependencies

The drug injection function of the multi-purpose injection gun and the outer frame of the belt needs to rely on LSCG, otherwise it will not work, but some text performances are still available

## Voice Commands

-   When using the command, you need to specify the wearer of the Wolf Girl Training Kit that is controlled by the current voice command. Use `Wolf Girl xxxx` to specify a controlled person, `xxxx` is her digital UID. For example: "Wolf Girl 20001 enters maintenance mode." ("狼女 20001 进入维护模式")
-   This auxiliary system can only connect and control the restraints of the Wolf Girl Training Kit.
-   When the `Wolf Girl system main control core` and the `Wolf Girl Pleasure Central Controller` are lost, they will not respond to voice commands.

### Restraint voice control

| Command                                 | Command Translated                                         | Permission              | Description                                                                                               |
| --------------------------------------- | ---------------------------------------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------- |
| \<狼女 xxxx> (关闭\|基础\|完全)听觉限制 | \<Wolf Girl xxxx> Hearing limitation (Off\|Basic\|full)    | Administrator and above | Set the hearing interference strength of the training set to Off \| Normal Limit \| Strong Limit          |
| \<狼女 xxxx> (关闭\|基础\|完全)视觉限制 | \<Wolf Girl xxxx> Visual restrictions (Off\|Basic\|full)   | Administrator and above | Set the visual obstruction strength of the training suit to Off\|Normal Restriction\|Strong Restriction   |
| \<狼女 xxxx> (关闭\|基础\|完全)语言限制 | \<Wolf Girl xxxx> Language restrictions (Off\|Basic\|full) | Administrator and above | Set the language restriction strength of the training suit to Off\|Normal Restriction\|Strong Restriction |
| \<狼女 xxxx> (关闭\|基础\|完全)手臂限制 | \<Wolf Girl xxxx> Arm Restriction (Off\|Basic\|Full)       | Administrator and above | Set the arm restraint strength of the training suit to Off\|Slight Restriction\|Strong Restriction        |
| \<狼女 xxxx> (关闭\|基础\|完全)行走限制 | \<Wolf Girl xxxx> leg restraint (Off\|Basic\|Full)         | Administrator and above | Set the leg restraint strength of the training suit to Off\|Slight Restriction\|Strong Restriction        |
| \<狼女 xxxx> (关闭\|寸止\|拒绝)高潮锁   | \<Wolf Girl xxxx> Orgasm Lock (Off\|edge\|deny)            | Administrator and above | Set the orgasm lock control module of the training suit to Off\|edge\|deny Mode                           |
| \<狼女 xxxx> (关闭\|打开\|最大)振动器   | \<Wolf Girl xxxx> Vibrator (Off\|On\|max)                  | Administrator and above | Set the vibrator working power of the training suit to Off\|Normal\|Maximum                               |

### Restraint extension function

| Command                               | Command Translated                                           | Permission                | Description                                                                                                                    |
| ------------------------------------- | ------------------------------------------------------------ | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| \<狼女 xxxx> (关闭\|打开)公开操作权限 | \<Wolf Girl xxxx> Public operation permissions (Close\|Open) | Administrator and above   | Set the manual operation mode permissions of the training suit restraints to close\|open                                       |
| \<狼女 xxxx> 离开这个房间             | \<Wolf Girl xxxx> Leave this room                            | Administrator and above   | Force the wolf girl to leave the current room and enter the room selection page                                                |
| \<狼女 xxxx> 强行离开这个房间         | \<Wolf Girl xxxx> Force-leave this room                      | Administrator and above   | Make the wolf girl forcefully leave the current room and enter any EIL facility room                                           |
| \<狼女 xxxx> 到我这里来               | \<Wolf Girl xxxx> Come to me                                 | Administrator and above   | This command is a Beep-specific command that makes the wolf girl forcefully leave the current room and enter the sender's room |
| \<狼女 xxxx> 存储色彩方案             | \<Wolf Girl xxxx> Save color scheme                          | Administrator and above   | Store the color configuration file of the current wolf girl training suit and apply it in subsequent maintenance supplements   |
| \<狼女 xxxx> 查询高潮统计             | \<Wolf Girl xxxx> Get orgasm statistics                      | Administrator and above   | Display the orgasm statistics and orgasm success rate of the wolf girl                                                         |
| \<狼女 xxxx> 查询狼女训练统计         | \<Wolf Girl xxxx> Get wolf girl training statistics          | Administrator and above   | Display the operation time of this auxiliary system, the last maintenance time, the time of wearing the training suit, etc.    |
| \<狼女 xxxx> 扫描身体敏感部位         | \<Wolf Girl xxxx> Scan sensitive body parts                  | Administrator and above   |                                                                                                                                |
| \<狼女 xxxx> (进入\|退出)维护模式     | \<Wolf Girl xxxx> (Enter\|Exit) Maintainance mode            | Administrator and above   | Enter \| exit maintenance mode, used to replenish the kit to a complete state and apply the stored color scheme                |
| \<狼女 xxxx> 注射催情剂               | \<Wolf Girl xxxx> Inject aphrodisiac                         | Administrator and above   | Inject aphrodisiac into the wolf girl, making her more sensitive for a period of time (the pleasure rises faster)              |
| \<狼女 xxxx> 注射抑制剂               | \<Wolf Girl xxxx> Inject inhibitor                           | Administrator and above   | Inject inhibitor into the wolf girl, making her less sensitive for a period of time (the pleasure rises slower)                |
| \<狼女 xxxx> 注射麻醉剂               | \<Wolf Girl xxxx> Inject anesthetic                          | Administrator and above   | Inject anesthetic into the wolf girl, causing her muscles to relax and unable to move for a period of time                     |
| \<狼女 xxxx> 注射恢复剂               | \<Wolf Girl xxxx> Inject recovery agent                      | Administrator and above   | Inject recovery agent into the wolf girl to contact the muscle relaxation effect of anesthetic                                 |
| \<狼女 xxxx> 注射泛用驱散剂           | \<Wolf Girl xxxx> Inject general repellent                   | Administrator and above   | Inject general repellent into the wolf girl to clean up magic and potion effects                                               |
| 注射枪模式切换 身份芯片               | Injection gun mode switch id chip                            | Only those with props     | Fill the injection gun with the wolf girl identity chip to trigger the installation of the wolf girl kit                       |
| 注射枪模式切换 催情剂                 | Injection gun mode switch Aphrodisiac                        | Only those with props     | Fill the syringe gun with aphrodisiacs and inject potions into players who do not have the Wolf Girl Kit                       |
| 注射枪模式切换 抑制剂                 | Switch the syringe gun mode to Inhibitors                    | Only those who have props | Fill the syringe gun with inhibitors and inject potions into players who do not have the Wolf Girl Kit                         |
| 注射枪模式切换 麻醉剂                 | Switch the syringe gun mode to Anesthetics                   | Only those who have props | Fill the syringe gun with Anesthetics and inject potions into players who do not have the Wolf Girl Kit                        |
| 注射枪模式切换 恢复剂                 | Switch the syringe gun mode to Restoration                   | Only those who have props | Fill the syringe gun with Restoration and inject potions into players who do not have the Wolf Girl Kit                        |

### Voice permission settings

| Command                                            | Command Translated                                                    | Permission              | Description                                                                            |
| -------------------------------------------------- | --------------------------------------------------------------------- | ----------------------- | -------------------------------------------------------------------------------------- |
| \<狼女 xxxx> (关闭\|打开)恋人语音权限              | \<Wolf Girl xxxx> (Close\|Open) Lover voice permission                | Master                  | Close\|Open lover's voice command permission for intelligent assistance system         |
| \<狼女 xxxx> 设置(添加\|移除)\<管理员 UID>语音权限 | \<Wolf Girl xxxx> (Add\|Remove) \<Administrator UID> voice permission | Lover and above         | Add or remove a user's permission to use the wolf girl's intelligent assistance system |
| \<狼女 xxxx> 查询语音权限                          | \<Wolf Girl xxxx> get voice permission                                | Administrator and above | Display current voice control permission settings and permission list                  |

### Tasks and rewards

| Command                                  | Command Translated                                                    | Permission              | Description                                                                                                                              |
| ---------------------------------------- | --------------------------------------------------------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| \<狼女 xxxx> 忍耐 10 次高潮              | \<Wolf Girl xxxx> Endure \<nr> orgasms                                | Administrator or above  | Assign an orgasm endurance task, which must be completed within the set task time, and the number of times can be set at will            |
| \<狼女 xxxx> 向 5 人乞求高潮             | \<Wolf Girl xxxx> Beg for an orgasm from \<nr> people                 | Administrator or above  | Assign an orgasm begging task, which requires being played with by \<nr> people with different UIDs to orgasm within the task time       |
| \<狼女 xxxx> 让 5 人玩弄你的(胸部\|阴部) | \<Wolf Girl xxxx> Let \<nr> people play with your (breasts\|genitals) | Administrator or above  | Assign a playing task, which requires being played with the corresponding parts by \<nr> people with different UIDs within the task time |
| \<狼女 xxxx> 向 5 人乞求鞭打             | \<Wolf Girl xxxx> Beg for whipping from \<nr> people                  | Administrator or above  | Assign a whipping begging task, which requires being whipped by \<nr> people with different UIDs within the task time                    |
| \<狼女 xxxx> 设置任务时间为 10 分钟      | \<Wolf Girl xxxx> Set the task time to \<nr> minutes                  | Administrator or above  | Set the task time for the above tasks, which can be set at will, and the penalty mode will be turned on when the task timeouts           |
| \<狼女 xxxx> 设置惩罚时间为 10 分钟      | \<Wolf Girl xxxx> Set the penalty time to \<nr> minutes               | Administrator or above  | Set the penalty time after the task timeout fails, which can be set at will                                                              |
| \<狼女 xxxx> (关闭\|打开)高潮惩罚模式    | \<Wolf Girl xxxx> (Turn on \|Turn off ) Orgasm punishment Mode        | Administrator or above  | Turn off\|on the orgasm punishment mode. After turning it on, each orgasm will cause the restraint to become more severe                 |
| \<狼女 xxxx> (进入\|关闭)惩罚模式        | \<Wolf Girl xxxx> (Enter\|Exit) Punishment Mode                       | Administrator and above | Manually enter\|exit the punishment mode for mission failure                                                                             |
| \<狼女 xxxx> 查询奖励积分                | \<Wolf Girl xxxx> Get reward points                                   | Administrator and above | Display the current number of reward points                                                                                              |
| \<狼女 xxxx> (奖励\|扣除)5 积分          | \<Wolf Girl xxxx> (Reward\|Deduct) \<nr> points                       | Administrator and above | Add\|Deduct 5 reward points, the number can be set at will                                                                               |
| 使用奖励积分 允许高潮                    | Use reward points Allow orgasm                                        | Only wearer             | Spend 1 reward point to unlock the orgasm lock                                                                                           |
| 使用奖励积分 关闭(视觉\|听觉)限制        | Use reward points Turn off (visual\|auditory) restrictions            | Only wearer             | Spend 1 reward point to turn off visual\|auditory restrictions                                                                           |
| 使用奖励积分 关闭语言限制                | Use reward points Turn off language restrictions                      | Only wearer             | Spend 2 reward points to turn off language restrictions                                                                                  |
| 使用奖励积分 关闭(手臂\|行走)限制        | Use reward points Turn off (arm\|leg) restraints                      | Only wearer             | Spend 3 reward points to turn off arm\|walking restrictions                                                                              |

## Action Instructions

When wearing the Wolf Girl Training Set, an additional action will appear at the neck (collar position) and hips (chastity belt position). The wearer can use this action to store or unfold most of the restraints of the Wolf Girl Training Set.
