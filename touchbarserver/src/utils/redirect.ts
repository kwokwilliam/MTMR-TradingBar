export const redirectGenerator = (url: string) => {
	return `<meta http-equiv="Refresh" content="0; url=${url}" />`
}