let appliedExtensions = false;

export function applyExtensions()
{
    if (appliedExtensions)
        return;

    require("./extensions/**/*.*");
    appliedExtensions = true;
}