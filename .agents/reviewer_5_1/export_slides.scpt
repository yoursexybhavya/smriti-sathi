set pptxPath to POSIX file "/Users/krishnajangid/Documents/antigravity/peaceful-hertz/Herodotus_Pitch_Presentation.pptx"
set outFolder to POSIX file "/Users/krishnajangid/Documents/antigravity/peaceful-hertz/.agents/reviewer_5_1/slides"

tell application "Keynote Creator Studio"
    set theDoc to open pptxPath
    delay 1
    export theDoc to file outFolder as slide images with properties {image format:JPEG, compression factor:0.9}
    close theDoc saving no
end tell
