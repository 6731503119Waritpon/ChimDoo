export interface AboutFeature {
    iconName: string;
    color: string;
    title: string;
    desc: string;
}

export interface AboutData {
    tagline: string;
    description: string;
    features: AboutFeature[];
    credits: string;
}

export interface AppVersion {
    id: string;
    version: string;
    releaseDate: string;
    title: string;
    changes: string[];
    isLatest: boolean;
}

export interface PolicySection {
    title: string;
    content: string;
}

export interface PrivacyPolicyData {
    lastUpdated: string;
    sections: PolicySection[];
}
