import { createHash, randomBytes } from 'crypto';
import { JSDOM } from 'jsdom';


export const flattenObject = (obj: any, parentKey = '', separator = '_') => {
    const result: any = {};

    for (const [key, value] of Object.entries(obj)) {
        const newKey = parentKey ? `${parentKey}${separator}${key}` : key;

        if (Array.isArray(value)) {

            value.forEach((item, index) => {
                if (typeof item === 'object' && item !== null) {

                    Object.assign(result, flattenObject(item, `${newKey}${separator}${index}`, separator));
                } else {

                    result[`${newKey}${separator}${index}`] = item;
                }
            });
        } else if (value && typeof value === 'object') {

            if (value.constructor.name === 'ObjectId') {
                result[newKey] = value.toString();
            } else {
                Object.assign(result, flattenObject(value, newKey, separator));
            }
        } else {
            result[newKey] = value;
        }
    }

    return result;
};


export const base64URLEncode = (buffer: Buffer) => {
    return buffer
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

export const sha256 = (buffer: Buffer) => {
    return createHash('sha256').update(buffer).digest();
}

export const generateCodeVerifier = (): string => {
    const verifier = randomBytes(32).toString('base64url');
    if (verifier.length < 43) {
        throw new Error('Generated code_verifier is too short.');
    }
    return verifier.slice(0, 128);
}
export const generateCodeChallenge = (verifier: string): string => {
    const hash = createHash('sha256').update(verifier).digest('base64url');
    return hash;
}


export const parseDiffRowHtml = (diffRowHtml: string) => {
    const dom = new JSDOM(diffRowHtml);
    const document = dom.window.document;


    const columnTypeElement = document.querySelector(".historicalCellContainer > .micro");
    const columnType = columnTypeElement?.textContent?.trim() || null;

    let newValue: string | null = null;
    let oldValue: string | null = null;

    const diffElement = document.querySelector(".historicalCellValue.diff");
    if (diffElement) {
        const inlineBlocks = diffElement.querySelectorAll(".inline-block");
        inlineBlocks.forEach((element) => {
            const pill = element.querySelector(".cellToken");
            if (pill) {
                const value = pill.textContent ? pill.textContent.trim() : '';
                const style = pill.getAttribute("style");
                if (style && style.includes("line-through")) {
                    oldValue = value;
                } else {
                    newValue = value;
                }
            }
        });

        const foreignRecords = diffElement.querySelectorAll(".foreignRecord");
        foreignRecords.forEach((record) => {
            const value = record.textContent ? record.textContent.trim() : '';
            if (record.classList.contains("added")) {
                newValue = value;
            }
            if (record.classList.contains("removed")) {
                oldValue = value;
            }
        });
    }

    return { columnType, oldValue, newValue };
};


export const transformInput = (data: Record<string, any>, issueId: string) => {
    const result = [];
    try {


        for (const [activityId, activityData] of Object.entries(data.rowActivityInfoById)) {
            const { diffRowHtml, createdTime, originatingUserId } = activityData as Record<string, any>
            const { columnType, oldValue, newValue } = parseDiffRowHtml(diffRowHtml);

            result.push({
                uuid: activityId,
                issueId,
                columnType: columnType || "Unknown",
                oldValue: oldValue || null,
                newValue: newValue || null,
                createdDate: new Date(createdTime).toISOString(),
                authoredBy: data.rowActivityOrCommentUserObjById[originatingUserId]?.name || "Unknown",
            });
        }

        return result;
    }
    catch (error) {
        console.log('error', error)
        return result;
    }
}
