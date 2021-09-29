import { MessageEmbedOptions } from 'discord.js';

export default function isSnippetRes(object: any): object is MessageEmbedOptions {
    if (
        Object.keys(object).some(
            key =>
                ![
                    'title',
                    'url',
                    'author',
                    'description',
                    'thumbnail',
                    'fields',
                    'image',
                    'footer'
                ].includes(key)
        )
    )
        return false;

    if (
        Object.keys(object.thumbnail || {})?.some(
            key => !['url', 'proxyURL', 'height', 'width'].includes(key)
        )
    )
        return false;

    if (
        Object.keys(object.image || {})?.some(
            key => !['url', 'proxyURL', 'height', 'width'].includes(key)
        )
    )
        return false;

    if (
        Object.keys(object.footer || {})?.some(
            key => !['text', 'iconURL', 'proxyIconURL'].includes(key)
        )
    )
        return false;

    if (
        object.fields?.some(field =>
            Object.keys(field || {})?.some(
                key => !['name', 'value', 'inline'].includes(key)
            )
        )
    )
        return false;

    return true;
}
