import { Skill } from "./skills.model";

export class Skills {
    private Skills: Skill [] = [
        new Skill (
            'Electronics',
            'Expertise in handling, installing, or repairing various electronic devices and systems, such as televisions, sound systems, home automation devices, and small appliances.'
        ),
        new Skill (
            'Plumbing',
            'Installing, maintaining, and repairing water and drainage systems. Tasks include fixing leaks, unclogging drains, installing fixtures, or setting up water systems to ensure smooth operation and proper water flow.'
        ),
        new Skill (
            'Deliveries / Errands',
            'Dependable assistance with delivering packages, groceries, or other goods, as well as running errands such as picking up prescriptions or dry cleaning, ensuring quick and efficient service.'
        ),
        new Skill (
            'Assembly / Mounting',
            'Proficient in assembling furniture, equipment, or appliances, and mounting items like TVs, shelves, or artwork. This skill guarantees sturdy and accurate assembly with attention to detail.'
        ),
        new Skill (
            'Moving',
            'Expertise in helping with packing, lifting, loading, and unloading during a move. This includes ensuring items are handled with care to avoid damage during transportation.'
        ),
        new Skill (
            'Cleaning',
            'Thorough and efficient cleaning services for homes, offices, or specific areas. Includes deep cleaning, regular maintenance, or specialized cleaning tasks to ensure a spotless environment.'
        ),
        new Skill (
            'Outdoor Help',
            'Assistance with tasks such as gardening, landscaping, yard work, or outdoor maintenance. This includes mowing lawns, trimming hedges, or clearing debris to keep outdoor spaces clean and organized.'
        ),
        new Skill (
            'Interior decor',
            'Creative support for enhancing the aesthetic and functionality of indoor spaces. Tasks include selecting and arranging furniture, choosing color schemes, and adding decorative elements to create a cohesive and visually pleasing interior.'
        )
    ];

    getSkills () {
        return [...this.Skills];
    }
}