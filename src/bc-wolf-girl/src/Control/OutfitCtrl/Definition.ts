import { OutfitItemType, buildOutfitItemMap } from "bc-utilities";

export const OutfitItems: OutfitItemType[] = [
    {
        Asset: {
            Name: "ElectronicTag",
            Group: "ItemNeckAccessories",
        },
        Color: ["#595959", "Default", "#FFFFFF"],
        Craft: {
            Name: "Wolf Girl Tag Mk.II",
            Description:
                "An exquisite electronic display board, originally used as an operating panel and display screen in the Wolf Girl and Cat Girl suits, but after the successful miniaturization of holographic projection technology, the interactive function of the device was abandoned. Now it is just a simple electronic tag, used to display the wearer's identity and affiliation, and also as a pass and payment method when going out alone. The low-power screen only needs body temperature to operate continuously, and does not require power supply and maintenance. Although the original interactive function has been abandoned, the wiring and pads on the internal circuit board have not been cancelled. After a certain modification, many functions can be expanded.",
            Property: "Comfy",
        },
        Property: { OverridePriority: 41 },
    },
    {
        Asset: {
            Name: "VibeHeartPiercings",
            Group: "ItemNipplesPiercings",
        },
        Color: ["#6C6C6C", "Default"],
        Craft: {
            Name: "Wolf Girl Nipple Pleasure Module Mk.II",
            Description:
                "The pleasure stimulation module that is clamped on the nipple is also used as a backup positioning beacon to monitor and record every sexual excitement of the wolf girl. It can be linked to the pleasure controller to provide greater pleasure or punishment. Because of its simple and reliable structure and the use of body temperature to provide working energy, it almost does not need to be disassembled for maintenance. It is the cheapest module in the set. There are even frequent activities by second-level agents to buy other wolf girl kits and give away this component. The development engineer of this module suffered a huge blow and had serious psychological barriers for a time. In the end, she stuffed herself into the wolf girl training assembly line and became a wolf girl. It was really a pity.",
            Property: "Arousing",
        },
        Property: { OverridePriority: 13 },
    },
    {
        Asset: {
            Name: "VibeNippleClamp",
            Group: "ItemNipples",
        },
        Color: ["#787878"],
        Craft: {
            Name: "Wolf Girl Multifunctional Nipple Clamp Mk.II",
            Property: "Arousing",
            Description:
                "A pair of small nipple clamps, which clamp the nipples to bring a sense of tightness that cannot be ignored and can vibrate to provide pleasure. However, its power is not high, and the weak pleasure it provides is difficult for the wearer to reach orgasm using only the nipples. Instead, it reminds the wearer of their identity and certain facts of lust at all times. The built-in electric shock module is naturally indispensable, but this generation of electric shock module cancels the defibrillator mode function, because the research found that a large number of reckless owners used this function to punish wolf girls, causing the wolf girls to be in danger of life. We oppose such rude and arrogant behavior, and will blacklist customers who abuse this function.",
        },
        Property: { OverridePriority: 22 },
    },
    {
        Asset: {
            Name: "LockingVibePlug",
            Group: "ItemButt",
        },
        Color: ["Default"],
        Craft: {
            Name: "Wolf Girl Anal Control Module Mk.II",
            Property: "Arousing",
            Description:
                "The module inserted into the anus, the new generation of products has added the option of releasing protein glue for permanent bonding in the expansion and locking function. The relevant structure has been proven to be reliable and non-rejecting, and can safely replace the sphincter to control excretion. The installed vibration and thrusting module has upgraded the power and strengthened the structure, avoiding the serious problem of the previous generation of products breaking and damaging in certain extreme use situations, causing physical trauma. The electric shock module limits the maximum power limit to improve battery life. In addition, a converter is installed in the tail compartment, which can slowly convert excrement into energy to provide its own operation, and can also provide energy for other modules in the form of wireless transmission.",
        },
    },
    {
        Asset: {
            Name: "VibeHeartClitPiercing",
            Group: "ItemVulvaPiercings",
        },
        Color: ["#595959", "Default"],
        Craft: {
            Name: "Wolf Girl Clitoris Pleasure Module Mk.II",
            Property: "Arousing",
            Description:
                "The pleasure stimulation module uses a metal clamp at the base of the clitoris, which is also a backup positioning beacon. It integrates a new generation of sensors to monitor and record the sexual excitement data of the wolf girl every time and links the pleasure control system to perform data analysis to provide greater pleasure rewards or repeated orgasm destruction as punishment. Because of its simple and reliable structure and the use of body temperature to provide working energy, it almost does not need to be disassembled and maintained. However, in the high-power working mode, the anal control module needs to provide additional energy for normal operation. Please do not keep it in full-load operation for a long time, because the heat dissipation problem caused by its small size is very serious and may even burn the circuit.",
        },
        Property: { OverridePriority: 13 },
    },
    {
        Asset: {
            Name: "FuturisticMuzzle",
            Group: "ItemMouth3",
        },
        Color: ["Default", "Default", "Default", "#FF0000"],
        Craft: {
            Name: "Wolf Girl Muzzle Outer Layer Additional Module Mk.II",
            Property: "Comfy",
            Description:
                "The muzzle's outer protective system is replaced with a new generation of composite materials. Although the thickness is slightly increased compared to the first generation of wolf girl outer muzzle, there is no need to worry about the extra weight. The built-in air detection and filtration system effectively prevents the wolf girl from inhaling toxic and harmful substances in the air. If necessary, the external air path can be completely closed and the internal compressed air tank can be used for safe breathing for fifteen minutes. The built-in metal mesh and Kevlar lining protect the fragile face. The optional flexible LCD screen can display specific patterns or text on the wolf girl's face to facilitate communication when necessary. The police model can be equipped with a pheromone analysis system to track specific targets.",
        },
    },
    {
        Asset: {
            Name: "FuturisticMuzzle",
            Group: "ItemMouth2",
        },
        Color: ["Default"],
        Craft: {
            Name: "Wolf Girl Muzzle Mk.II",
            Property: "Comfy",
            Description:
                "The muzzle is used to prevent the wolf girl from uncontrollably spitting saliva everywhere when wearing a ball gag. It has a built-in waterproof layer and water guide belt to prevent saliva accumulation, and a new converter with the same anal control module is added to convert the flowing saliva into energy supply components to ensure that the face is always breathable and dry. The full coverage design of the mouth can prevent the wolf girl from eating privately or accidentally eating outside, but there is no need to worry about feeding problems after wearing it. The mouth is equipped with an eating auxiliary module. After the owner authorizes the unlocking, the mouth can be replenished with water and fed liquid food without removing the mouth gag. However, please do not feed food other than the recommended types, otherwise it may cause damage to the module and possible suffocation.",
        },
    },
    {
        Asset: {
            Name: "FuturisticHarnessBallGag",
            Group: "ItemMouth",
        },
        Color: ["#5E5E5E", "#242424", "Default", "Default", "Default"],
        Craft: {
            Name: "Wolf girl training ball Mk.II",
            Property: "Small",
            Description:
                "The gag is made of high-strength rubber to prevent the wolf girl from hurting innocent people during the initial training. Most of the time, it will not hinder communication, but it has a built-in sensor to detect what the wolf girl said or tried to say. It can be expanded into a spherical or phallic shape according to the corresponding settings to penetrate deep into the throat to punish and restrict communication. It is also connected to the feeding auxiliary module of the inner layer of the gag. When used with the phallic mode, it can quickly train the wolf girl's oral sex ability. The new generation of products has added a directional sound wave generator to restrict and replace the wolf girl's external communication. The fixed rigging is a metal composite braided cable, which cannot be violently removed without hurting the wolf girl.",
        },
        Property: { OverridePriority: 35 },
    },
    {
        Asset: {
            Name: "FuturisticHarness",
            Group: "ItemTorso",
        },
        Color: ["#666666", "#7A7A7A", "#393939", "#FFFFFF"],
        Craft: {
            Name: "Wolf Girl Training Harness Mk.II",
            Property: "Comfy",
            Description:
                "The harness on the wolf girl can be used as a data bus to provide wired data communication connections between modules and to be used as an external signal transmission antenna. Although each module already has the ability to form a wireless network, the existence of the physical link of the harness increases throughput and saves a lot of energy consumption, which is still very necessary. The main body is made of metal composite braided cables, and the interface is also waterproof. It does not need to be removed before entering the water like the previous generation of products. Thanks to its reliable structural strength, it can even be used as a climbing rope and traction rope when necessary, but please note that the original communication function cannot be restored after being disassembled into a climbing rope or traction rope.",
        },
    },
    {
        Asset: {
            Name: "HighSecurityHarness",
            Group: "ItemTorso2",
        },
        Color: ["#444444", "Default"],
        Craft: {
            Name: "Wolf Girl Harness Outer Frame Mk.II",
            Property: "Comfy",
            Description:
                "The extra frame on the outer layer of the harness is attached to the training harness in most cases, but it can also be used independently. It stores nutrient solution and various medicines, which are prepared and injected into the body in real time according to the control core instructions to ensure that the body is in the best condition at all times. It also has a quick replenishment interface, which makes maintenance simple and convenient. The waist node stores several emergency injections, which can be used to rescue others when necessary. Although this device is a component of the Wolf Girl Training Set, a large number of users purchase this component separately to use medicines. Please note that this product is only a special equipment, not a medical device. EIL is not responsible for possible accidents caused by the use of this component.",
        },
        Property: { OverridePriority: 1 },
    },
    {
        Asset: {
            Name: "SciFiPleasurePanties",
            Group: "ItemPelvis",
        },
        Color: ["#454545", "#202020", "#878787", "#202020", "#878787", "#878787", "Default"],
        Craft: {
            Name: "Wolf girl training underwear Mk.II",
            Property: "Arousing",
            Description:
                "The new generation of training underwear has been adapted and connected to the central control component, avoiding the embarrassment of the previous generation of products requiring secondary configuration. The embedded position of the built-in vibrator has been modified to be more reasonable and will not cause bruises to the skin after long-term work, while the electric shock device also limits high-power electric shocks. Although it is acceptable as a punishment, we despise the wanton venting of emotions without regard for the health of the wolf girl. It has a pleasure detection and orgasm control module, which can make the wolf girl stay on the edge of orgasm or destroy the orgasm so that she has no satisfaction, which helps to tame the wolf girl. And the opening is thoughtfully designed, which will not affect excretion and masturbation when the owner allows it.",
        },
        Property: { TypeRecord: { c: 0, i: 0, o: 2, s: 0 } },
    },
    {
        Asset: {
            Name: "FuturisticCuffs",
            Group: "ItemArms",
        },
        Color: ["#4F4F4F", "#353535", "#FFFFFF"],
        Craft: {
            Name: "Wolf Girl Bracelet Mk.II",
            Property: "Comfy",
            Description:
                "The restraint control system installed on the arm is a very beautiful decorative ring when not activated. The new generation of products has upgraded the electrical stimulation system, which can maintain the muscle state to avoid atrophy under long-term restraint, and can enhance explosive power to deal with certain emergencies when necessary. The extensive use of composite materials makes the weight lighter than the previous generation while still having ultra-high strength. Even the lowest configuration of this generation of products is equipped with a tactile simulation system, which can provide the wearer with a realistic hug warmth at any time. Whether it is a human or a god, it is never shameful to require the body temperature of another individual. EIL will never lose its focus on emotional and psychological needs.",
        },
    },
    {
        Asset: {
            Name: "FuturisticMittens",
            Group: "ItemHands",
        },
        Color: ["#777777", "#6E6E6E", "#3D3D3D", "Default"],
        Craft: {
            Name: "Wolf Girl Gloves Mk.II",
            Property: "Comfy",
            Description:
                "The Wolf Girl gloves, which use NMRB technology, abandon the complex and high-power ERMR, are more reliable, lightweight and energy-efficient. The speed of switching between fingerless gloves and normal gloves is nearly three times faster, and anomalies caused by insufficient power supply during failure or mode conversion are avoided. The internal padding has also been upgraded to enhance temperature management and reduce the impact of high temperatures in summer and low temperatures in winter, while the tactile obstruction module has been moved to the wrist locking ring to avoid repeated impacts that cause the module to fail. The optional adsorption climbing module has also become standard, which can also make the Wolf Girl's hands almost completely lose friction and unable to grasp objects.",
        },
        Property: { TypeRecord: { typed: 1 } },
    },
    {
        Asset: {
            Name: "FuturisticAnkleCuffs",
            Group: "ItemFeet",
        },
        Color: ["#000000", "#494949", "#303030", "#FFFFFF"],
        Craft: {
            Name: "Wolf Girl Smart Leg Ring Mk.II",
            Property: "Comfy",
            Description:
                "The new ankle restraint control system cancels the automatic connection and locking function of the aggressive sensor, saving more space for installing the limb action controller. After linking the step controller component, the lower limbs' mobility can be fully controlled. The additional action posture stabilization system can prevent the body from losing stability and even falling in almost all extreme situations. Although it helps to provide additional safety in some special scenarios, EIL does not recommend such use, let alone private modification, otherwise the warranty terms will be invalidated, and EIL will not compensate for accidents caused by such application scenarios of the prop.",
        },
    },
    {
        Asset: {
            Name: "FuturisticHeels2",
            Group: "ItemBoots",
        },
        Color: ["#212121", "#4A4A4A", "#383838", "#3D3D3D", "#404040", "#3D3D3D", "Default"],
        Craft: {
            Name: "Wolf Girl Foot Training System Mk.II",
            Property: "Comfy",
            Description:
                "The high-heeled shoes have metal wires woven into the lining, and the built-in electric structure in the heel can change the height of the heel according to the training progress or reward and punishment rules. The bottom is embedded with a heavy metal plate as a counterweight to increase stability and passively train the leg muscles to prevent muscle atrophy caused by long-term restraint. It is also equipped with a motion sensor to count the amount of exercise, and cooperates with other components to collect data to assist the central controller in making decisions to modify the training plan and modify the nutritional meal formula accordingly to add trace elements to better maintain physical health. The additional neural interference module can be used as a reward to greatly reduce the pain caused by walking in high heels, and can also be linked to the pace controller to take over the movement of the wolf girl.",
        },
        Property: { TypeRecord: { typed: 1 } },
    },
    {
        Asset: {
            Name: "FuturisticLegCuffs",
            Group: "ItemLegs",
        },
        Color: ["#000000", "#4A4A4A", "#383838", "#FFFFFF"],
        Craft: {
            Name: "Wolf Girl Step Stance Controller Mk.II",
            Property: "Comfy",
            Description:
                "The pace controller for training elegant walking posture can be connected and completely fixed as part of the control system, which can minimize the ability to struggle and escape. The built-in electrical stimulation module has been upgraded to a version with tactile simulation, which can massage the thigh muscles to give rewards and also provide arousal and teasing. The muscle strength limiter has been replaced with a model that can finely adjust the output. Combined with other leg components, it completely takes over the mobility, so that the owner can play more. Although the second-generation wolf girl suit uses composite materials to reduce weight, this module is still made of alloy as an additional weight to assist stability and prevent muscle and blood vessel problems caused by long-term restraint.",
        },
    },
    {
        Asset: {
            Name: "FuturisticVibrator",
            Group: "ItemVulva",
        },
        Color: ["#454545", "#555555", "Default"],
        Craft: {
            Name: "Wolf Girl Central Pleasure Controller Mk.II",
            Property: "Arousing",
            Description:
                "The new generation of central pleasure controller is equipped with an advanced computing unit and can be used as a backup central controller. The vibration and thrusting module has a new mechanical expansion function in this version, which can adjust the diameter to a certain extent, fill the vagina to give stronger stimulation, or shrink to a level that can be felt but cannot get pleasure during the climax. The electric shock device also limits the maximum power and trigger conditions, deletes the setting that any sound can trigger the electric shock, and deletes the part of the urination control module in the custom interface so that it can only use a few preset modes, and has a mechanical emergency unlocking to avoid setting errors or some special circumstances that may cause physical damage.",
        },
    },
    {
        Asset: {
            Name: "FuturisticEarphones",
            Group: "ItemEars",
        },
        Color: ["#898989", "#2A2A2A", "Default"],
        Craft: {
            Name: "Wolf Girl Multi-Purpose Auxiliary Earphones Mk.II",
            Property: "Comfy",
            Description:
                "The microphone array upgrade combined with the new neural interference module can even calculate the launch position of every bullet that passes by in a short time when running at full power. The active noise reduction system also benefits from the module upgrade and has stronger performance. It can accurately locate the faint cry for help in a battlefield full of bullets and spells, and naturally make it so that the wolf girl can only hear the master's words in a busy city. However, the neural interference module will not be open source in the official release, because in the initial testing, we found some situations that distorted the use of the module, and such behavior crossed the bottom line of EIL.",
        },
    },
    {
        Asset: {
            Name: "InteractiveVisor",
            Group: "ItemHead",
        },
        Color: ["#5D5D5D"],
        Craft: {
            Name: "Wolf Girl Enhanced Auxiliary Goggles Mk.II",
            Property: "Comfy",
            Description:
                "The transparent circuit and battery are integrated into the thin and reliable polymer shell, and the sensor matrix is ​​placed in the temples on both sides. The effective recognition range has been increased to 220 degrees, and the recognition distance and accuracy have been significantly improved, while the old The visual control module has been replaced with a neural interference module, which avoids the shortcomings of poor battery life caused by excessive power consumption and the disadvantages caused by large amounts of heat. With the headphone module, it can perform absolute interference between vision and hearing, and continuously adjust vision. Or you can directly play the training and brainwashing video, but the remote scheduling function of this module has been locked by the hardware to prevent hackers from hijacking the master's instructions.",
        },
    },
    {
        Asset: { Name: "FuturisticBra", Group: "ItemBreast" },
        Color: ["#4A4A4A", "#FFFFFF", "#FFFFFF", "#4B4B4B", "#363636"],
        Craft: {
            Name: "Wolf Girl Composite Sports Bra Mk.II",
            Property: "Comfy",
            Description:
                "The bra is made of electric muscle and equipped with a motion sensor to adjust the posture in real time. It is thin and soft to avoid the overly tight feeling of the previous generation, while providing sufficient support for the breasts to avoid the unstable center of gravity caused by the shaking of the breasts during high-speed movement. When it detects an attempt to masturbate through the breasts, it will tighten and harden to prevent the wolf girl from getting any pleasure. It can also massage and electrically stimulate the breasts to keep them healthy, and can also provide pleasure as a reward. It has a built-in vital sign monitor and sends physiological data to the terminal in real time, so that the owner can check the wolf girl's physical condition at any time. Although a certain breast enhancement effect was observed during the test, it is not universal. Please do not flash firmware not recommended by EIL at will.",
        },
        Property: { TypeRecord: { typed: 2 } },
    },
    {
        Asset: { Name: "FuturisticCollar", Group: "ItemNeck" },
        Color: ["#606060", "Default", "Default", "Default"],
        Craft: {
            Name: "Wolf Girl System Main Control Core Mk.II",
            Property: "Comfy",
            Description:
                "The appearance of the central controller has not changed much, but the computing power and battery life have been upgraded. It can calculate the body parameters and the posture parameters of each component more quickly and accurately for timely adjustment. Although the computing power is strong enough, its ability to parse the virtual currency algorithm has been limited by both software and hardware to avoid being used for other purposes. After installing the expensive communication module, the multiple wolf girls owned by the owner can form a network connection similar to the Misaka network proposed by Academy City at close range, sharing information and processing power among the wolf girls. And it is equipped with additional visual sensors to avoid abnormal environmental perception caused by damaged goggles.",
        },
    },
];

export const OutfitItemsMap = buildOutfitItemMap(OutfitItems);

export const ToolsCrate: OutfitItemType = {
    Asset: {
        Name: "FuturisticCrate",
        Group: "ItemDevices",
    },
    Color: [
        "#222222",
        "Default",
        "#444444",
        "Default",
        "Default",
        "#FF1199",
        "Default",
        "#444444",
        "#555555",
        "#3B7F2C",
        "Default",
        "Default",
        "#BBBBFF",
        "Default",
    ],
    Craft: {
        Name: "Wolf Girl Training Facility Maintenance Cabin Mk.II",
        Property: "Comfy",
        Description:
            "The basic wolf girl transport storage cabin has been newly equipped with surgical modules and component maintenance modules, and sufficient materials are stored to quickly make restraints on site. The addition of a new generation of robotic arms and scanning matrices makes the operation more precise, and the restraints are more comfortable and close-fitting. The installation of the surgical module means that the wolf girl does not have to worry about life danger even if she suffers serious trauma. However, due to the fact that the production and yield of the injection-type nano-surgical robot are not ideal, the huge purchase price and high maintenance cost have caused the price of the maintenance cabin to rise sharply on the black market, and even attacked the EIL team. The component will now be remotely dropped by EIL.",
    },
};

export const ToolsVisor: OutfitItemType = {
    Asset: {
        Name: "InteractiveVisor",
        Group: "ItemHead",
    },
    Color: ["#3A3A3A"],
    Craft: {
        Name: "Wolf Girl Trainer Multi-purpose Auxiliary Terminal Mk.II",
        Property: "Thin",
        Description:
            "Standard auxiliary goggles, connected to the EIL database to view the wolf girl's physiological status, identity information and other data. The sensor in one of the temples was removed and replaced with an auxiliary positioning system to remotely deploy the training facility maintenance cabin, which is convenient for trainers to perform component maintenance and additional training props on the wolf girl at any time, and naturally also convenient for trainers to hunt new targets. It has a built-in biometric lock and self-destruct system. It will automatically lock when the auxiliary terminal is removed, and will self-destruct when used by non-EIL registered personnel to avoid leakage of authority and information, effectively improving the security of the EIL internal network.",
    },
};

export const ToolsInjector: OutfitItemType = {
    Asset: {
        Name: "MedicalInjector",
        Group: "ItemHandheld",
    },
    Color: ["#8F8F8F"],
    Craft: {
        Name: "Wolf Girl Trainer Multi-Purpose Injection Gun Mk.II",
        Property: "Comfy",
        Description:
            "Multi-purpose injection gun, most of the time filled with a disposable identity chip for the initial installation and information registration of the training kit for the new wolf girl, but it can be replaced with various medicines, or even the injection-type nano-surgical robot used in the maintenance cabin, to perform first aid when necessary. The advanced injection gun will not leave needle holes on the skin, and can even be injected through clothing, and the extremely high injection speed does not worry about accidents when the target struggles.",
    },
};

export const Tools: OutfitItemType[] = [
    ToolsCrate,
    ToolsVisor,
    ToolsInjector,
    {
        Asset: {
            Name: "GlassFilled",
            Group: "ItemHandheld",
        },
        Color: "Default",
        Craft: {
            Name: "Water of Desire",
            Description: "A glass of water? Maybe.",
            Property: "Normal",
        },
    },
    {
        Asset: {
            Name: "GlassFilled",
            Group: "ItemHandheld",
        },
        Color: "Default",
        Craft: {
            Name: "Special Redbull",
            Description: "A mixture of Red Bull, alcohol, caffeine, steroids, gorilla testicle extract, etc., Power!",
            Property: "Normal",
        },
    },
];
